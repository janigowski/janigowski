import { error } from '@sveltejs/kit';
import { getResume } from '$content/index.server';

export async function load({ params }) { const resume = await getResume(params.slug); if (!resume) error(404, 'Resume not found'); return { resume: resume.resolvedResume }; }
