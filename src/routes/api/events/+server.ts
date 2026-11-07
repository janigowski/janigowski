import { getBookmarks } from '$content/index.server';
import { handleEventRequest } from '$lib/events/handle';
import { createEventBackend } from '$server/events';

export async function POST({ request }) {
	const bookmarks = await getBookmarks();
	const backend = createEventBackend();
	return handleEventRequest(request, {
		knownEntities: new Set(bookmarks.map((bookmark) => bookmark.slug)),
		store: backend?.store,
		limiter: backend?.limiter ?? { async allow() { return true; } }
	});
}
