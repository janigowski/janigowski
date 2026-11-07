import { env } from '$env/dynamic/private';
import { Redis } from '@upstash/redis';
import { UpstashEventStore, UpstashRateLimiter, type EventStore, type RateLimiter } from '$lib/events/store';

export function createEventBackend(): { store: EventStore; limiter: RateLimiter } | undefined {
	const url = env.UPSTASH_REDIS_REST_URL;
	const token = env.UPSTASH_REDIS_REST_TOKEN;
	if (!url || !token) return undefined;
	const redis = new Redis({ url, token, enableTelemetry: false });
	return { store: new UpstashEventStore(redis), limiter: new UpstashRateLimiter(redis) };
}
