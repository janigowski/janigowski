import type { BookmarkType } from './types';

const bookmarkTypeSet: Record<BookmarkType, true> = {
	article: true,
	video: true,
	podcast: true,
	link: true
};

export const bookmarkTypes = Object.keys(bookmarkTypeSet) as BookmarkType[];

export function normalizeTags(value: unknown): string[] {
	const source = Array.isArray(value) ? value : typeof value === 'string' ? [value] : [];
	const tags = source
		.filter((tag): tag is string => typeof tag === 'string')
		.map((tag) => tag.trim())
		.filter((tag) => tag.length > 0);
	return [...new Set(tags)];
}

export function hasNote(body: string) {
	return body.trim().length > 0;
}

const bookmarkUtm = {
	utm_source: 'janigowski.dev',
	utm_medium: 'referral',
	utm_campaign: 'bookmarks'
} as const;

export function bookmarkSourceHref(href: string) {
	let url: URL;
	try {
		url = new URL(href);
	} catch {
		return href;
	}
	for (const [key, value] of Object.entries(bookmarkUtm)) {
		if (!url.searchParams.has(key)) url.searchParams.set(key, value);
	}
	return url.toString();
}

export function formatCalendarDate(isoDate?: string) {
	if (!isoDate) return undefined;
	const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(isoDate);
	if (!match) return undefined;
	const year = Number(match[1]);
	const month = Number(match[2]);
	const day = Number(match[3]);
	const date = new Date(year, month - 1, day);
	if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return undefined;
	return {
		iso: `${match[1]}-${match[2]}-${match[3]}`,
		label: new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		}).format(date)
	};
}

export function sortBookmarks<T extends { published?: boolean; date?: string; title: string }>(items: T[]) {
	return items
		.filter((item) => item.published)
		.sort((a, b) => {
			if (a.date && b.date) {
				const byDate = b.date.localeCompare(a.date);
				if (byDate !== 0) return byDate;
			} else if (a.date) {
				return -1;
			} else if (b.date) {
				return 1;
			}
			return a.title.localeCompare(b.title);
		});
}

export type BookmarkSelection<T> = {
	bookmarks: T[];
	types: string[];
	tags: string[];
	typeCounts: Record<string, number>;
	tagCounts: Record<string, number>;
	typeTotal: number;
	tagTotal: number;
	selectedType?: string;
	selectedTag?: string;
};

function isBookmarkType(value: string): value is BookmarkType {
	return Object.hasOwn(bookmarkTypeSet, value);
}

function countsDescending(counts: Record<string, number>) {
	return Object.keys(counts).sort((a, b) => counts[b] - counts[a] || a.localeCompare(b));
}

export function selectBookmarks<T extends { bookmarkType: string; tags: string[] }>(
	bookmarks: T[],
	typeParam?: string | null,
	tagParam?: string | null
): BookmarkSelection<T> {
	const requestedType =
		typeParam && isBookmarkType(typeParam) && bookmarks.some((bookmark) => bookmark.bookmarkType === typeParam)
			? typeParam
			: undefined;
	const tagsInType = new Set(
		bookmarks
			.filter((bookmark) => !requestedType || bookmark.bookmarkType === requestedType)
			.flatMap((bookmark) => bookmark.tags)
	);
	const selectedTag = tagParam && tagsInType.has(tagParam) ? tagParam : undefined;
	const inTag = selectedTag ? bookmarks.filter((bookmark) => bookmark.tags.includes(selectedTag)) : bookmarks;
	const inType = requestedType
		? bookmarks.filter((bookmark) => bookmark.bookmarkType === requestedType)
		: bookmarks;
	const typeCounts: Record<string, number> = {};
	for (const bookmark of inTag) {
		typeCounts[bookmark.bookmarkType] = (typeCounts[bookmark.bookmarkType] ?? 0) + 1;
	}
	const tagCounts: Record<string, number> = {};
	for (const bookmark of inType) {
		for (const tag of new Set(bookmark.tags)) {
			tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
		}
	}
	return {
		bookmarks: bookmarks.filter(
			(bookmark) =>
				(!requestedType || bookmark.bookmarkType === requestedType) &&
				(!selectedTag || bookmark.tags.includes(selectedTag))
		),
		types: countsDescending(typeCounts),
		tags: countsDescending(tagCounts),
		typeCounts,
		tagCounts,
		typeTotal: inTag.length,
		tagTotal: inType.length,
		selectedType: requestedType,
		selectedTag
	};
}
