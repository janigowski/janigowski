import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import matter from 'gray-matter';
import {
	formatCalendarDate,
	hasNote,
	normalizeTags,
	selectBookmarks,
	sortBookmarks
} from '../src/lib/content/bookmarks.ts';

type Fixture = {
	title: string;
	date?: string;
	published?: boolean;
	bookmarkType: string;
	tags: string[];
	body: string;
};

const items: Fixture[] = [
	{
		title: 'Older article',
		date: '2026-09-01',
		published: true,
		bookmarkType: 'article',
		tags: ['React', 'front-end'],
		body: 'A note'
	},
	{
		title: 'Saved article',
		date: '2026-10-07',
		published: true,
		bookmarkType: 'article',
		tags: ['React', 'application architecture', 'React'],
		body: ''
	},
	{
		title: 'Newest video',
		date: '2026-11-01',
		published: true,
		bookmarkType: 'video',
		tags: ['React'],
		body: '   '
	},
	{
		title: 'Podcast',
		date: '2026-08-01',
		published: true,
		bookmarkType: 'podcast',
		tags: ['testing'],
		body: 'Show notes'
	},
	{
		title: 'Hidden link',
		date: '2026-12-01',
		published: false,
		bookmarkType: 'link',
		tags: ['React'],
		body: ''
	},
	{
		title: 'Alpha',
		date: '2026-10-07',
		published: true,
		bookmarkType: 'link',
		tags: ['front-end'],
		body: ''
	}
];

const published = sortBookmarks(items);

function test(name: string, fn: () => void) {
	try {
		fn();
		console.log(`ok ${name}`);
	} catch (error) {
		console.error(`fail ${name}`);
		throw error;
	}
}

test('sorts newest saved date first and drops unpublished entries', () => {
	assert.deepEqual(
		published.map((item) => item.title),
		['Newest video', 'Alpha', 'Saved article', 'Older article', 'Podcast']
	);
});

test('breaks date ties by title', () => {
	assert.ok(published.findIndex((item) => item.title === 'Alpha') < published.findIndex((item) => item.title === 'Saved article'));
});

test('treats empty and whitespace notes as absent', () => {
	assert.equal(hasNote(''), false);
	assert.equal(hasNote(' \n\t'), false);
	assert.equal(hasNote('A note'), true);
});

test('normalizes tags', () => {
	assert.deepEqual(normalizeTags([' React ', 'React', '', 'front-end']), ['React', 'front-end']);
	assert.deepEqual(normalizeTags('architecture'), ['architecture']);
	assert.deepEqual(normalizeTags(undefined), []);
});

test('formats calendar dates without shifting the day', () => {
	assert.deepEqual(formatCalendarDate('2026-10-07'), { iso: '2026-10-07', label: 'October 7, 2026' });
	assert.equal(formatCalendarDate('2026-02-31'), undefined);
	assert.equal(formatCalendarDate(undefined), undefined);
});

test('combines one type and one tag', () => {
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

test('seed bookmark matches the source article and has no note', () => {
	const file = readFileSync(new URL('../content/bookmarks/modularizing-react-apps.mdx', import.meta.url), 'utf8');
	const parsed = matter(file);
	assert.equal(parsed.content.trim(), '');
	assert.equal(parsed.data.title, 'Modularizing React Applications with Established UI Patterns');
	assert.equal(parsed.data.author, 'Juntao QIU | 邱俊涛');
	assert.equal(parsed.data.url, 'https://martinfowler.com/articles/modularizing-react-apps.html');
	assert.equal(parsed.data.bookmarkType, 'article');
	assert.equal(parsed.data.date, '2026-10-07');
	assert.equal(parsed.data.sourceDate, '2023-02-16');
	assert.equal(parsed.data.published, true);
	assert.equal(
		parsed.data.description,
		'Learn how to apply established UI patterns for a more organized and maintainable codebase and discover the benefits of layering architecture in React development'
	);
	assert.deepEqual(normalizeTags(parsed.data.tags), ['React', 'application architecture', 'front-end']);
	assert.equal(hasNote(parsed.content), false);
});
