import { getBaseResume } from '$content/index.server';

export async function load() { return { resume: await getBaseResume() }; }
