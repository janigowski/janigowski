import { error } from '@sveltejs/kit';
import { getPost } from '$content/index.server';

export async function load({ params }) { const item = await getPost(params.slug); if (!item) error(404, 'post not found'); return { item }; }
