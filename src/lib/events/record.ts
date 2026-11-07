import { bookmarkClickEvent } from './schema';

export function recordBookmarkClick(slug: string) {
	try {
		void fetch('/api/events', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ name: bookmarkClickEvent, entity: slug }),
			keepalive: true
		}).catch(() => {});
	} catch {
		return;
	}
}
