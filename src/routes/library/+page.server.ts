import { getBooks, getLibraryStats } from '$content/index.server';

export async function load({ url }) {
	const books = await getBooks();
	const selectedType = url.searchParams.get('type') ?? undefined;
	const selectedTag = url.searchParams.get('tag') ?? undefined;
	const types = Array.from(new Set(books.map((book) => book.bookType))).sort(
		(a, b) => books.filter((book) => book.bookType === b).length - books.filter((book) => book.bookType === a).length
	);
	const tags = Array.from(new Set(books.map((book) => book.tag))).sort(
		(a, b) => books.filter((book) => book.tag === b).length - books.filter((book) => book.tag === a).length
	);
	const typeCounts = Object.fromEntries(types.map((type) => [type, books.filter((book) => book.bookType === type).length]));
	const tagCounts = Object.fromEntries(tags.map((tag) => [tag, books.filter((book) => book.tag === tag).length]));

	return {
		books: books.filter(
			(book) => (!selectedType || book.bookType === selectedType) && (!selectedTag || book.tag === selectedTag)
		),
		types,
		tags,
		typeCounts,
		tagCounts,
		total: books.length,
		selectedType,
		selectedTag,
		stats: getLibraryStats(books)
	};
}
