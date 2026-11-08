import assert from 'node:assert/strict';
import matter from 'gray-matter';
import {
	bookmarkDestinationLabel,
	bookmarkImage,
	bookmarkSourceHref,
	formatCalendarDate,
	hasNote,
	normalizeTags,
	selectBookmarks,
	showBookmarkImage,
	sortBookmarks
} from '../src/lib/content/bookmarks.ts';

type Loaded = {
	title: string;
	date?: string;
	published?: boolean;
	bookmarkType: string;
	tags: string[];
	body: string;
	url: string;
	image?: string;
	author?: string;
	description?: string;
};

const sources: Record<string, string> = {
	'older-article.mdx': `---
title: "Older article"
author: "Ada Fixture"
url: "https://example.com/articles/older?id=42#notes"
image: "https://example.com/older.png"
bookmarkType: "article"
tags:
  - React
  - front-end
date: "2026-09-01"
published: true
description: "An older saved article"
---
A note
`,
	'saved-article.mdx': `---
title: "Saved article"
author: "Ada Fixture"
url: "https://example.com/articles/saved"
image: "https://example.com/saved.png"
bookmarkType: "article"
tags:
  - " React "
  - React
  - ""
  - application architecture
date: "2026-10-07"
published: true
description: "A saved article without a note"
---
`,
	'newest-video.mdx': `---
title: "Newest video"
author: "Ada Fixture"
url: "https://example.com/watch?v=abc"
bookmarkType: "video"
tags:
  - React
date: "2026-11-01"
published: true
description: "A video bookmark"
---
   
`,
	'podcast.mdx': `---
title: "Podcast"
author: "Ada Fixture"
url: "https://example.com/shows/podcast"
image: "not a url"
bookmarkType: "podcast"
tags: testing
date: "2026-08-01"
published: true
description: "A podcast bookmark"
---
Show notes
`,
	'hidden-link.mdx': `---
title: "Hidden link"
author: "Ada Fixture"
url: "https://example.com/hidden"
bookmarkType: "link"
tags:
  - React
date: "2026-12-01"
published: false
description: "An unpublished bookmark"
---
`,
	'alpha.mdx': `---
title: "Alpha"
author: "Ada Fixture"
url: "https://example.com/alpha"
bookmarkType: "link"
tags:
  - front-end
date: "2026-10-07"
published: true
description: "A link that ties on the saved date"
---
`
};

function loadBookmark(source: string): Loaded {
	const parsed = matter(source);
	const body = parsed.content.trim();
	const date = parsed.data.date;
	const author = parsed.data.author;
	const description = parsed.data.description;
	return {
		title: String(parsed.data.title),
		date: typeof date === 'string' ? date : undefined,
		published: parsed.data.published === true,
		bookmarkType: String(parsed.data.bookmarkType),
		tags: normalizeTags(parsed.data.tags),
		body,
		url: String(parsed.data.url),
		image: bookmarkImage(parsed.data.image),
		author: typeof author === 'string' ? author : undefined,
		description: typeof description === 'string' ? description : undefined
	};
}

const loaded = Object.values(sources).map(loadBookmark);
const published = sortBookmarks(loaded);

function test(name: string, fn: () => void) {
	try {
		fn();
		console.log(`ok ${name}`);
	} catch (error) {
		console.error(`fail ${name}`);
		throw error;
	}
}

test('loads MDX into a listing sorted by saved date and drops unpublished entries', () => {
	assert.deepEqual(
		published.map((item) => item.title),
		['Newest video', 'Alpha', 'Saved article', 'Older article', 'Podcast']
	);
	assert.equal(published.some((item) => item.title === 'Hidden link'), false);
	assert.equal(published[0]?.author, 'Ada Fixture');
	assert.equal(published[0]?.description, 'A video bookmark');
});

test('breaks date ties by title', () => {
	assert.ok(published.findIndex((item) => item.title === 'Alpha') < published.findIndex((item) => item.title === 'Saved article'));
});

test('normalizes tags parsed from MDX', () => {
	assert.deepEqual(published.find((item) => item.title === 'Saved article')?.tags, ['React', 'application architecture']);
	assert.deepEqual(published.find((item) => item.title === 'Podcast')?.tags, ['testing']);
	assert.deepEqual(normalizeTags([' React ', 'React', '', 'front-end']), ['React', 'front-end']);
	assert.deepEqual(normalizeTags('architecture'), ['architecture']);
	assert.deepEqual(normalizeTags(undefined), []);
	const uppercase = loadBookmark(`---
title: "Uppercase tag"
url: "https://example.com/uppercase"
bookmarkType: "video"
tags:
  - TED
date: "2026-11-08"
published: true
---
`);
	assert.deepEqual(uppercase.tags, ['TED']);
	assert.deepEqual(normalizeTags([' TED ', 'TED']), ['TED']);
});

test('treats empty and whitespace notes as absent', () => {
	assert.equal(hasNote(published.find((item) => item.title === 'Saved article')?.body ?? 'missing'), false);
	assert.equal(hasNote(published.find((item) => item.title === 'Newest video')?.body ?? 'missing'), false);
	assert.equal(hasNote(published.find((item) => item.title === 'Older article')?.body ?? ''), true);
	assert.equal(hasNote(''), false);
	assert.equal(hasNote(' \n\t'), false);
	assert.equal(hasNote('A note'), true);
});

test('formats calendar dates from frontmatter without shifting the day', () => {
	assert.deepEqual(formatCalendarDate(published.find((item) => item.title === 'Saved article')?.date), {
		iso: '2026-10-07',
		label: 'October 7, 2026'
	});
	const invalid = loadBookmark(`---
title: "Invalid date"
url: "https://example.com/invalid"
bookmarkType: "link"
date: "2026-02-31"
published: true
---
`);
	assert.equal(invalid.date, '2026-02-31');
	assert.equal(formatCalendarDate(invalid.date), undefined);
	assert.equal(formatCalendarDate(undefined), undefined);
});

test('filters the loaded listing by one type and one tag', () => {
	const selected = selectBookmarks(published, 'article', 'React');
	assert.deepEqual(
		selected.bookmarks.map((item) => item.title),
		['Saved article', 'Older article']
	);
	assert.equal(selected.selectedType, 'article');
	assert.equal(selected.selectedTag, 'React');
});

test('counts tags inside the selected type and types inside the selected tag', () => {
	const byType = selectBookmarks(published, 'article', null);
	assert.deepEqual(byType.tagCounts, { React: 2, 'front-end': 1, 'application architecture': 1 });
	assert.equal(byType.tagTotal, 2);
	assert.equal(byType.tags.includes('testing'), false);
	assert.deepEqual(byType.typeCounts, { article: 2, video: 1, link: 1, podcast: 1 });

	const byTag = selectBookmarks(published, null, 'React');
	assert.deepEqual(byTag.typeCounts, { article: 2, video: 1 });
	assert.equal(byTag.typeTotal, 3);
	assert.equal(byTag.types.includes('podcast'), false);
	assert.equal(byTag.types.includes('link'), false);
	assert.equal(byTag.tagCounts.React, 3);
	assert.equal(byTag.tagCounts['front-end'], 2);
});

test('drops type and tag values that would match nothing', () => {
	const unknown = selectBookmarks(published, 'nope', 'missing');
	assert.equal(unknown.selectedType, undefined);
	assert.equal(unknown.selectedTag, undefined);
	assert.equal(unknown.bookmarks.length, published.length);

	const mismatched = selectBookmarks(published, 'video', 'front-end');
	assert.equal(mismatched.selectedType, 'video');
	assert.equal(mismatched.selectedTag, undefined);
	assert.deepEqual(
		mismatched.bookmarks.map((item) => item.title),
		['Newest video']
	);
	assert.deepEqual(mismatched.tags, ['React']);

	const unknownType = selectBookmarks(published, 'link', 'testing');
	assert.equal(unknownType.selectedTag, undefined);
	assert.equal(unknownType.selectedType, 'link');
});

test('attributes the parsed source URL and shows the stored destination', () => {
	const older = published.find((item) => item.title === 'Older article');
	assert.ok(older);
	assert.equal(bookmarkDestinationLabel(older.url), 'example.com/articles/older?id=42#notes');
	assert.equal(bookmarkDestinationLabel(older.url).includes('utm_'), false);
	assert.equal(
		bookmarkSourceHref(older.url),
		'https://example.com/articles/older?id=42&utm_source=janigowski.dev&utm_medium=referral&utm_campaign=bookmarks#notes'
	);
	const stored = 'https://example.com/articles/item';
	const long =
		'https://example.com/a/very/long/path/that-would-overflow-a-narrow-bookmark-card/item?id=42#notes';
	assert.equal(bookmarkDestinationLabel(stored), 'example.com/articles/item');
	assert.equal(bookmarkDestinationLabel(stored).includes('utm_'), false);
	assert.equal(
		bookmarkDestinationLabel(long),
		'example.com/a/very/long/path/that-would-overflow-a-narrow-bookmark-card/item?id=42#notes'
	);
	assert.equal(bookmarkDestinationLabel('https://example.com'), 'example.com');
	assert.equal(bookmarkDestinationLabel('not a url'), 'not a url');
	assert.equal(bookmarkSourceHref(stored).includes('utm_source=janigowski.dev'), true);
});

test('adds bookmark attribution without dropping queries or fragments', () => {
	assert.equal(
		bookmarkSourceHref('https://example.com/articles/item'),
		'https://example.com/articles/item?utm_source=janigowski.dev&utm_medium=referral&utm_campaign=bookmarks'
	);
	assert.equal(
		bookmarkSourceHref('https://example.com/watch?id=42&list=design#notes'),
		'https://example.com/watch?id=42&list=design&utm_source=janigowski.dev&utm_medium=referral&utm_campaign=bookmarks#notes'
	);
});

test('keeps UTM values already present on the source URL', () => {
	const href = bookmarkSourceHref(
		'https://example.com/post?utm_source=newsletter&id=9&utm_medium=email#section'
	);
	const url = new URL(href);
	assert.equal(url.searchParams.get('utm_source'), 'newsletter');
	assert.equal(url.searchParams.get('utm_medium'), 'email');
	assert.equal(url.searchParams.get('utm_campaign'), 'bookmarks');
	assert.equal(url.searchParams.get('id'), '9');
	assert.equal(url.hash, '#section');
	assert.equal(url.searchParams.getAll('utm_source').length, 1);
	assert.deepEqual(
		new URL(bookmarkSourceHref('https://example.com/post?utm_source=one&utm_source=two')).searchParams.getAll(
			'utm_source'
		),
		['one', 'two']
	);
	assert.equal(bookmarkSourceHref('not a url'), 'not a url');
});

test('uses a remote thumbnail only when the stored image URL can load', () => {
	const saved = published.find((item) => item.title === 'Saved article');
	const podcast = published.find((item) => item.title === 'Podcast');
	assert.equal(saved?.image, 'https://example.com/saved.png');
	assert.equal(showBookmarkImage(saved?.image, undefined), true);
	assert.equal(podcast?.image, undefined);
	assert.equal(bookmarkImage(undefined), undefined);
	assert.equal(bookmarkImage(''), undefined);
	assert.equal(bookmarkImage('   '), undefined);
	assert.equal(bookmarkImage('not a url'), undefined);
	assert.equal(showBookmarkImage(undefined, undefined), false);
	const present = 'https://example.com/thumb.png';
	const broken = 'https://example.com/missing-thumbnail.png';
	assert.equal(bookmarkImage(present), present);
	assert.equal(showBookmarkImage(broken, broken), false);
	assert.equal(showBookmarkImage(present, broken), true);
});
