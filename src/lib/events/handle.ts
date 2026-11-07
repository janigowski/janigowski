import { MAX_EVENT_BODY_BYTES, parseEventBody, type TrackedEvent } from '$lib/events/schema';
import type { EventStore, RateLimiter } from '$lib/events/store';

export async function handleEventRequest(
	request: Request,
	options: {
		knownEntities: ReadonlySet<string>;
		store: EventStore | undefined;
		limiter: RateLimiter;
	}
) {
	const advertisedLength = Number(request.headers.get('content-length') ?? 0);
	if (Number.isFinite(advertisedLength) && advertisedLength > MAX_EVENT_BODY_BYTES) {
		return json({ message: 'Payload too large' }, 413);
	}
	const origin = request.headers.get('origin');
	if (origin !== new URL(request.url).origin) return json({ message: 'Cross-origin request' }, 403);
	const text = await request.text();
	const parsed = parseEventBody(text);
	if (!parsed.ok) return json({ message: parsed.message }, parsed.status);
	if (!options.knownEntities.has(parsed.event.entity)) return json({ message: 'Unknown entity' }, 400);
	if (!options.store) return new Response(null, { status: 204 });
	try {
		if (!(await options.limiter.allow(parsed.event))) return json({ message: 'Too many requests' }, 429);
		await options.store.increment(parsed.event);
	} catch {
		return new Response(null, { status: 204 });
	}
	return new Response(null, { status: 204 });
}

function json(body: { message: string }, status: number) {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'content-type': 'application/json' }
	});
}

export type { TrackedEvent };
