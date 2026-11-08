import { selectBookmarks } from '$content/bookmarks';
import { getBookmarks } from '$content/index.server';

export async function load({ url }) {
	const bookmarks = await getBookmarks();
	return selectBookmarks(bookmarks, url.searchParams.get('type'), url.searchParams.get('tag'));
}
