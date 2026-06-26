import { getResumes } from '$content/index.server';

export async function load() { return { resumes: await getResumes() }; }
