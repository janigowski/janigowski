import { getProjects } from '$content/index.server';

export async function load() { return { items: await getProjects() }; }
