import { getBooks, getLatestBooks, getLatestPosts, getPosts, getProjects, getRandomProjects } from '$content/index.server';

export async function load() { const [books, posts, projects] = await Promise.all([getBooks(), getPosts(), getProjects()]); return { latestBooks: getLatestBooks(books, 3), latestPosts: getLatestPosts(posts, 3), randomProjects: getRandomProjects(projects, 3), bookReviews: books.filter((book) => book.body.trim().length > 0).slice(0, 3) }; }
