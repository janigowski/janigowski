import {
	eventKey,
	normalizeCounts,
	rateKey,
	RATE_LIMIT,
	RATE_WINDOW_SECONDS,
	type EventName,
	type TrackedEvent
} from './schema';

export interface EventStore {
	increment(event: TrackedEvent): Promise<void>;
	counts(name: EventName): Promise<Record<string, number>>;
}

export interface RateLimiter {
	allow(event: TrackedEvent): Promise<boolean>;
}

export type EventRedis = {
	hincrby(key: string, field: string, increment: number): Promise<number>;
	hgetall(key: string): Promise<Record<string, unknown> | null>;
	incr(key: string): Promise<number>;
	expire(key: string, seconds: number): Promise<number>;
};

export class MemoryEventStore implements EventStore {
	private countsByEvent = new Map<EventName, Map<string, number>>();

	async increment(event: TrackedEvent) {
		const counts = this.countsByEvent.get(event.name) ?? new Map<string, number>();
		counts.set(event.entity, (counts.get(event.entity) ?? 0) + 1);
		this.countsByEvent.set(event.name, counts);
	}

	async counts(name: EventName) {
		return Object.fromEntries(this.countsByEvent.get(name) ?? []);
	}
}

export class MemoryRateLimiter implements RateLimiter {
	private hits = new Map<string, number[]>();

	constructor(
		private limit = RATE_LIMIT,
		private windowMs = RATE_WINDOW_SECONDS * 1000
	) {}

	async allow(event: TrackedEvent, now = Date.now()) {
		const key = rateKey(event);
		const recent = (this.hits.get(key) ?? []).filter((hit) => now - hit < this.windowMs);
		if (recent.length >= this.limit) {
			this.hits.set(key, recent);
			return false;
		}
		recent.push(now);
		this.hits.set(key, recent);
		return true;
	}
}

export class UpstashEventStore implements EventStore {
	constructor(private redis: Pick<EventRedis, 'hincrby' | 'hgetall'>) {}

	async increment(event: TrackedEvent) {
		await this.redis.hincrby(eventKey(event.name), event.entity, 1);
	}

	async counts(name: EventName) {
		return normalizeCounts(await this.redis.hgetall(eventKey(name)));
	}
}

export class UpstashRateLimiter implements RateLimiter {
	constructor(
		private redis: Pick<EventRedis, 'incr' | 'expire'>,
		private limit = RATE_LIMIT,
		private windowSeconds = RATE_WINDOW_SECONDS
	) {}

	async allow(event: TrackedEvent) {
		const key = rateKey(event);
		const count = await this.redis.incr(key);
		if (count === 1) await this.redis.expire(key, this.windowSeconds);
		return count <= this.limit;
	}
}
