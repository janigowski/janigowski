export const eventNames = ['bookmark_click'] as const;

export type EventName = (typeof eventNames)[number];

export const bookmarkClickEvent: EventName = 'bookmark_click';

export type TrackedEvent = {
	name: EventName;
	entity: string;
};

export const MAX_EVENT_BODY_BYTES = 512;
export const RATE_LIMIT = 30;
export const RATE_WINDOW_SECONDS = 60;

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function eventKey(name: EventName) {
	return `events:${name}`;
}

export function rateKey(event: TrackedEvent) {
	return `events:rate:${event.name}:${event.entity}`;
}

export function isEventName(value: unknown): value is EventName {
	return typeof value === 'string' && eventNames.includes(value as EventName);
}

export function isEventEntity(value: unknown): value is string {
	return typeof value === 'string' && value.length <= 80 && slugPattern.test(value);
}

export function normalizeCounts(value: unknown): Record<string, number> {
	if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
	const counts: Record<string, number> = {};
	for (const [key, raw] of Object.entries(value)) {
		if (!isEventEntity(key)) continue;
		const count = typeof raw === 'number' ? raw : typeof raw === 'string' ? Number(raw) : Number.NaN;
		if (!Number.isInteger(count) || count < 0) continue;
		counts[key] = count;
	}
	return counts;
}

export function parseEventBody(text: string) {
	if (new TextEncoder().encode(text).length > MAX_EVENT_BODY_BYTES) {
		return { ok: false as const, status: 413, message: 'Payload too large' };
	}
	let data: unknown;
	try {
		data = JSON.parse(text);
	} catch {
		return { ok: false as const, status: 400, message: 'Invalid JSON' };
	}
	if (!data || typeof data !== 'object' || Array.isArray(data)) {
		return { ok: false as const, status: 400, message: 'Invalid event' };
	}
	const record = data as { name?: unknown; entity?: unknown };
	if (!isEventName(record.name)) return { ok: false as const, status: 400, message: 'Unknown event' };
	if (!isEventEntity(record.entity)) return { ok: false as const, status: 400, message: 'Invalid entity' };
	return { ok: true as const, event: { name: record.name, entity: record.entity } };
}
