import { error } from '@sveltejs/kit';
import { getBook } from '$content/index.server';

export async function load({ params }) { const book = await getBook(params.slug); if (!book) error(404, 'Book not found'); return { book }; }
