import { getBooks, getPosts } from '$content/index.server';

export async function load() {
	const [posts, books] = await Promise.all([getPosts(), getBooks()]);
	const reviews = books.filter((book) => book.body.trim().length > 0);
	return {
		items: [...posts, ...reviews].sort((a, b) => {
			if (a.date && b.date) return new Date(b.date).getTime() - new Date(a.date).getTime();
			if (a.date) return -1;
			if (b.date) return 1;
			return a.title.localeCompare(b.title);
		})
	};
}
