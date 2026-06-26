import { getPosts } from '$content/index.server';

export async function load() { return { items: await getPosts() }; }
