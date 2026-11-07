import { error } from '@sveltejs/kit';
import { getBookmark } from '$content/index.server';

export async function load({ params }) {
	const bookmark = await getBookmark(params.slug);
	if (!bookmark) error(404, 'Bookmark not found');
	return { bookmark };
}
