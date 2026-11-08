import { selectBookmarks } from '$content/bookmarks';
import { getBookmarks } from '$content/index.server';

export async function load({ url }) {
	const bookmarks = await getBookmarks();
	const layoutParam = url.searchParams.get('layout');
	const layout: 'a' | 'b' | 'c' | undefined =
		layoutParam === 'a' || layoutParam === 'b' || layoutParam === 'c' ? layoutParam : undefined;
	return {
		...selectBookmarks(bookmarks, url.searchParams.get('type'), url.searchParams.get('tag')),
		layout
	};
}
