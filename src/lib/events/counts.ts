import snapshot from './snapshot.json';
import { normalizeCounts } from './schema';

const counts = normalizeCounts(snapshot);

export function clickCount(slug: string) {
	return counts[slug] ?? 0;
}

export function formatClickCount(count: number) {
	const value = Number.isFinite(count) && count > 0 ? Math.floor(count) : 0;
	return value === 1 ? '1 click' : `${value} clicks`;
}
