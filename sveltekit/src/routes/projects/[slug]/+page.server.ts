import { error } from '@sveltejs/kit';
import { getProject } from '$content/index.server';

export async function load({ params }) { const item = await getProject(params.slug); if (!item) error(404, 'project not found'); return { item }; }
