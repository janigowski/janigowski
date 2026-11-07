import assert from 'node:assert/strict';
import { clickCount, formatClickCount } from '../src/lib/events/counts.ts';
import { handleEventRequest } from '../src/lib/events/handle.ts';
import { normalizeCounts, parseEventBody } from '../src/lib/events/schema.ts';
import {
	MemoryEventStore,
	MemoryRateLimiter,
	UpstashEventStore,
	UpstashRateLimiter,
	type EventRedis
} from '../src/lib/events/store.ts';

function test(name: string, fn: () => Promise<void> | void) {
	return Promise.resolve()
		.then(fn)
		.then(() => console.log(`ok ${name}`))
		.catch((error) => {
			console.error(`fail ${name}`);
			throw error;
		});
}

function request(body: string, origin = 'https://janigowski.dev', length = body.length) {
	return new Request('https://janigowski.dev/api/events', {
		method: 'POST',
		headers: { 'content-type': 'application/json', origin, 'content-length': String(length) },
		body
	});
}

const known = new Set(['modularizing-react-apps']);

await test('counts one click per stored event and reads the hash', async () => {
	const store = new MemoryEventStore();
	await store.increment({ name: 'bookmark_click', entity: 'modularizing-react-apps' });
	await store.increment({ name: 'bookmark_click', entity: 'modularizing-react-apps' });
	assert.deepEqual(await store.counts('bookmark_click'), { 'modularizing-react-apps': 2 });
	assert.equal(formatClickCount(2), '2 clicks');
	assert.equal(formatClickCount(1), '1 click');
	assert.equal(formatClickCount(0), '0 clicks');
});

await test('normalizes a redis hash and ignores unsafe fields', () => {
	assert.deepEqual(
		normalizeCounts({ 'modularizing-react-apps': '4', 'bad key': 2, negative: -1, broken: 'nope' }),
		{ 'modularizing-react-apps': 4 }
	);
	assert.deepEqual(normalizeCounts(null), {});
});

await test('uses the build snapshot for the published card count', () => {
	assert.equal(clickCount('modularizing-react-apps'), 0);
	assert.equal(clickCount('missing'), 0);
});

await test('rejects invalid event payloads', () => {
	assert.equal(parseEventBody('{').ok, false);
	assert.equal(parseEventBody('{"name":"signup","entity":"modularizing-react-apps"}').ok, false);
	assert.equal(parseEventBody('{"name":"bookmark_click","entity":"../secret"}').ok, false);
	assert.equal(parseEventBody(`{"name":"bookmark_click","entity":"${'a'.repeat(81)}"}`).ok, false);
	const parsed = parseEventBody('{"name":"bookmark_click","entity":"modularizing-react-apps","url":"https://secret.example"}');
	assert.equal(parsed.ok, true);
	if (parsed.ok) assert.deepEqual(parsed.event, { name: 'bookmark_click', entity: 'modularizing-react-apps' });
});

await test('stores a same-origin bookmark click once', async () => {
	const store = new MemoryEventStore();
	const response = await handleEventRequest(
		request('{"name":"bookmark_click","entity":"modularizing-react-apps"}'),
		{ knownEntities: known, store, limiter: new MemoryRateLimiter() }
	);
	assert.equal(response.status, 204);
	assert.deepEqual(await store.counts('bookmark_click'), { 'modularizing-react-apps': 1 });
});

await test('drops the event when storage is not configured', async () => {
	const response = await handleEventRequest(
		request('{"name":"bookmark_click","entity":"modularizing-react-apps"}'),
		{ knownEntities: known, store: undefined, limiter: new MemoryRateLimiter() }
	);
	assert.equal(response.status, 204);
});

await test('rejects cross-origin, unknown, oversized, and repeated events', async () => {
	const store = new MemoryEventStore();
	const limiter = new MemoryRateLimiter(1, 60_000);
	const options = { knownEntities: known, store, limiter };
	const crossOrigin = await handleEventRequest(
		request('{"name":"bookmark_click","entity":"modularizing-react-apps"}', 'https://evil.example'),
		options
	);
	assert.equal(crossOrigin.status, 403);
	const unknown = await handleEventRequest(
		request('{"name":"bookmark_click","entity":"not-a-bookmark"}'),
		options
	);
	assert.equal(unknown.status, 400);
	const oversized = await handleEventRequest(
		request('{"name":"bookmark_click","entity":"modularizing-react-apps"}', 'https://janigowski.dev', 900),
		options
	);
	assert.equal(oversized.status, 413);
	const first = await handleEventRequest(
		request('{"name":"bookmark_click","entity":"modularizing-react-apps"}'),
		options
	);
	const second = await handleEventRequest(
		request('{"name":"bookmark_click","entity":"modularizing-react-apps"}'),
		options
	);
	assert.equal(first.status, 204);
	assert.equal(second.status, 429);
	assert.deepEqual(await store.counts('bookmark_click'), { 'modularizing-react-apps': 1 });
});

await test('keeps navigation data intact when the store throws', async () => {
	const response = await handleEventRequest(
		request('{"name":"bookmark_click","entity":"modularizing-react-apps"}'),
		{
			knownEntities: known,
			limiter: new MemoryRateLimiter(),
			store: {
				async increment() {
					throw new Error('redis unavailable');
				},
				async counts() {
					return {};
				}
			}
		}
	);
	assert.equal(response.status, 204);
});

await test('adapts upstash hash commands without storing the destination', async () => {
	const hashes = new Map<string, Map<string, number>>();
	const strings = new Map<string, number>();
	const redis: EventRedis = {
		async hincrby(key, field, increment) {
			const hash = hashes.get(key) ?? new Map<string, number>();
			const next = (hash.get(field) ?? 0) + increment;
			hash.set(field, next);
			hashes.set(key, hash);
			return next;
		},
		async hgetall(key) {
			return Object.fromEntries(hashes.get(key) ?? []);
		},
		async incr(key) {
			const next = (strings.get(key) ?? 0) + 1;
			strings.set(key, next);
			return next;
		},
		async expire() {
			return 1;
		}
	};
	const store = new UpstashEventStore(redis);
	await store.increment({ name: 'bookmark_click', entity: 'modularizing-react-apps' });
	assert.deepEqual(hashes.get('events:bookmark_click'), new Map([['modularizing-react-apps', 1]]));
	assert.deepEqual(await store.counts('bookmark_click'), { 'modularizing-react-apps': 1 });
	const limiter = new UpstashRateLimiter(redis, 1, 60);
	assert.equal(await limiter.allow({ name: 'bookmark_click', entity: 'modularizing-react-apps' }), true);
	assert.equal(await limiter.allow({ name: 'bookmark_click', entity: 'modularizing-react-apps' }), false);
	assert.equal([...strings.keys()].some((key) => key.includes('http')), false);
});
