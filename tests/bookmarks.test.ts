import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
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

test('shows the stored host and path without added tracking parameters', () => {
	const stored = 'https://martinfowler.com/articles/modularizing-react-apps.html';
	const long =
		'https://example.com/a/very/long/path/that-would-overflow-a-narrow-bookmark-card/item?id=42#notes';
	assert.equal(bookmarkDestinationLabel(stored), 'martinfowler.com/articles/modularizing-react-apps.html');
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
		bookmarkSourceHref('https://martinfowler.com/articles/modularizing-react-apps.html'),
		'https://martinfowler.com/articles/modularizing-react-apps.html?utm_source=janigowski.dev&utm_medium=referral&utm_campaign=bookmarks'
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
	const present = 'https://martinfowler.com/articles/modularizing-react-apps/evolution-5.png';
	assert.equal(bookmarkImage(present), present);
	assert.equal(showBookmarkImage(present, undefined), true);
	assert.equal(bookmarkImage(undefined), undefined);
	assert.equal(bookmarkImage(''), undefined);
	assert.equal(bookmarkImage('   '), undefined);
	assert.equal(bookmarkImage('not a url'), undefined);
	assert.equal(showBookmarkImage(undefined, undefined), false);
	const broken = 'https://example.com/missing-thumbnail.png';
	assert.equal(showBookmarkImage(broken, broken), false);
	assert.equal(showBookmarkImage(present, broken), true);
});

test('seed bookmark matches the source article and has no note', () => {
	const file = readFileSync(new URL('../content/bookmarks/modularizing-react-apps.mdx', import.meta.url), 'utf8');
	const parsed = matter(file);
	assert.equal(parsed.content.trim(), '');
	assert.equal(parsed.data.title, 'Modularizing React Applications with Established UI Patterns');
	assert.equal(parsed.data.author, 'Juntao QIU | 邱俊涛');
	assert.equal(parsed.data.url, 'https://martinfowler.com/articles/modularizing-react-apps.html');
	assert.equal(
		parsed.data.image,
		'https://martinfowler.com/articles/modularizing-react-apps/evolution-5.png'
	);
	assert.equal(bookmarkImage(parsed.data.image), parsed.data.image);
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

const tedPlaylist = [
	['W7W1Vf_CMCc', '2012-06-04', '2012-06-04'],
	['1O7XbdYwLwk', '2013-09-10', '2011-10-27'],
	['mEaALm5PUq8', '2014-12-17', '2014-12-17'],
	['7bB_fVDlvhc', '2015-01-15', '2015-01-15'],
	['qOEB1Fr0_MM', '2015-06-19', '2015-06-19'],
	['8S0FDjFBj8o', '2015-11-08', '2015-01-15'],
	['jvBaRf9LHDs', '2016-03-30', '2016-03-30'],
	['LNHBMFCzznE', '2016-04-29', '2015-12-15'],
	['UF8uR6Z6KLc', '2016-05-29', '2008-03-07'],
	['Kc0Kthyo0hU', '2016-06-28', '2016-06-28'],
	['cJg_tPB0Nu0', '2016-07-11', '2016-07-11'],
	['-eBUcBfkVCo', '2016-07-20', '2013-12-18'],
	['P3fIZuW9P_M', '2016-07-30', '2014-02-07'],
	['vVsXO9brK7M', '2016-08-08', '2013-02-01'],
	['8KkKuTCFvzI', '2016-08-18', '2016-01-25'],
	['JYznK2ALuTU', '2016-08-28', '2016-01-11'],
	['oevfz3BuU8s', '2016-09-06', '2013-02-01'],
	['OL-ZrmtFNcg', '2016-09-16', '2013-02-10'],
	['4tfzMripV8M', '2016-09-26', '2015-01-20'],
	['GigYWy2UmOY', '2016-10-05', '2008-07-21'],
	['bf7BXwVeyWw', '2016-10-15', '2012-04-23'],
	['0d6iSvF1UmA', '2016-10-25', '2016-10-25'],
	['7jx0dTYUO5E', '2016-10-27', '2009-05-20'],
	['DFjIi2hxxf0', '2016-10-29', '2013-07-19'],
	['urntcMUJR9M', '2016-11-03', '2016-11-03'],
	['rrkrvAUbU9Y', '2016-11-25', '2009-08-25'],
	['7sxpKhIbr0E', '2016-12-17', '2013-12-05'],
	['arj7oStGLkU', '2017-01-08', '2016-04-06'],
	['_ayTA-tJr3A', '2017-01-31', '2015-01-29'],
	['KDQrMoksJ4Q', '2017-02-22', '2014-07-03'],
	['WD1IX1AFRZg', '2017-03-16', '2015-09-14'],
	['hqKafI7Amd8', '2017-04-07', '2012-08-30'],
	['GPaYrhUZSYQ', '2017-04-30', '2017-04-30'],
	['fXIeFJCqsPs', '2017-05-19', '2008-10-24'],
	['JqRiJn3rGqQ', '2017-06-08', '2013-02-11'],
	['VO6XEQIsCoM', '2017-06-28', '2007-01-16'],
	['lyu7v7nWzfo', '2017-07-18', '2017-07-18'],
	['Dceyy0cX6J4', '2017-08-27', '2016-09-27'],
	['0bRocfcPhHU', '2017-10-06', '2017-10-06'],
	['xRL2vVAa47I', '2017-12-12', '2017-12-12'],
	['0t-sG8FhC4E', '2017-12-29', '2017-11-17'],
	['Yr_poW-KK1Q', '2018-01-16', '2016-07-29'],
	['J6oMG7u9HGE', '2018-02-02', '2013-02-25'],
	['0NF8Pj9pdiw', '2018-02-20', '2015-10-29'],
	['rRepnhXq33s', '2018-03-09', '2009-10-16'],
	['esPRsT-lmw8', '2018-03-27', '2013-10-16'],
	['R7vmHGAshi8', '2018-04-13', '2015-02-09'],
	['s4thQcgLCqk', '2018-05-01', '2014-07-07'],
	['y2X7c9TUQJ8', '2018-05-18', '2015-06-01'],
	['Kqkoghq0G4A', '2018-06-05', '2015-12-31'],
	['9KaMufF0rAY', '2018-06-22', '2015-07-03'],
	['9UHW8zHzmGs', '2018-07-10', '2015-01-20'],
	['xl91YQwa1yg', '2018-07-27', '2017-01-10'],
	['2a9EVaTMfdw', '2018-08-14', '2014-01-27'],
	['r3wyCxHtGd0', '2018-08-31', '2008-01-09'],
	['bJ8Kq1wucsk', '2018-09-18', '2013-12-20'],
	['5MgBikgcWnY', '2018-10-05', '2013-03-14'],
	['th3nnEpITz0', '2018-10-23', '2017-02-06'],
	['xzbHtIrb14s', '2018-11-09', '2015-07-09'],
	['cv1IuoK1fJM', '2018-11-27', '2017-09-11'],
	['szaXR2_Smmk', '2018-12-14', '2013-02-25'],
	['-vZXgApsPCQ', '2019-01-01', '2017-01-06'],
	['qYvXk_bqlBk', '2019-01-18', '2016-07-19'],
	['c6WBiMLqkIM', '2019-02-05', '2015-03-06'],
	['e2NjLF_s6MM', '2019-02-22', '2017-05-08'],
	['OrAo8oBBFIo', '2019-03-12', '2010-09-27'],
	['fLJsdqxnZb0', '2019-03-29', '2012-02-01'],
	['ljqra3BcqWM', '2019-04-16', '2017-02-02'],
	['UyyjU8fzEYU', '2019-05-03', '2008-03-13'],
	['TFbv757kup4', '2019-05-21', '2015-12-04'],
	['9X68dm92HVI', '2019-06-07', '2009-05-19'],
	['FScfGU7rQaM', '2019-06-25', '2019-06-25'],
	['1mZAQC9djPE', '2019-10-06', '2014-03-20'],
	['wDGAkp1sHM4', '2020-01-17', '2020-01-17'],
	['jodhovumkHQ', '2020-04-17', '2013-08-30'],
	['5XD2kNopsUs', '2020-07-18', '2010-11-24'],
	['_QdPW8JrYzQ', '2020-10-18', '2016-02-01'],
	['jpe-LKn-4gM', '2021-01-18', '2012-11-29'],
	['ym6OYelD5fA', '2021-04-20', '2017-01-20'],
	['6Af6b_wyiwI', '2021-07-21', '2015-04-03'],
	['weNKci8MrfI', '2021-10-21', '2013-02-11'],
	['rq86Uu_-Xgg', '2022-01-20', '2018-08-27'],
	['VhtWWCaFzEg', '2022-04-22', '2013-05-16'],
	['eIho2S0ZahI', '2022-07-23', '2014-06-27'],
	['1K5SycZjGhI', '2022-10-23', '2010-01-29'],
	['V74AxCqOTvg', '2023-01-23', '2010-04-01'],
	['NHopJHSlVo4', '2023-04-25', '2010-09-02'],
	['o8NPllzkFhE', '2023-07-26', '2016-05-03'],
	['P6FORpg0KVo', '2023-10-26', '2023-10-26'],
	['TaQ3jQSGeIE', '2023-10-26', '2023-01-09'],
	['TK1mBqKvIyU', '2023-10-26', '2015-07-22'],
	['H14bBuluwB8', '2023-10-26', '2013-05-09']
] as const;

test('TED playlist bookmarks keep one TED tag, playlist dates, and no note', () => {
	assert.deepEqual(normalizeTags([' TED ', 'TED']), ['TED']);
	assert.deepEqual(normalizeTags('TED'), ['TED']);
	const expected = new Map<string, { date: string; sourceDate: string }>(
		tedPlaylist.map(([id, date, sourceDate]) => [id, { date, sourceDate }])
	);
	const dir = new URL('../content/bookmarks/', import.meta.url);
	const found = new Map<string, string>();
	for (const file of readdirSync(dir)) {
		if (!file.endsWith('.mdx')) continue;
		const parsed = matter(readFileSync(new URL(file, dir), 'utf8'));
		if (typeof parsed.data.url !== 'string') continue;
		let id: string | null = null;
		try {
			id = new URL(parsed.data.url).searchParams.get('v');
		} catch {
			id = null;
		}
		if (!id || !expected.has(id)) continue;
		const row = expected.get(id);
		found.set(id, file);
		assert.equal(parsed.content.trim(), '', file);
		assert.equal(hasNote(parsed.content), false, file);
		assert.equal(parsed.data.url, `https://www.youtube.com/watch?v=${id}`, file);
		assert.equal(parsed.data.image, `https://i.ytimg.com/vi/${id}/hqdefault.jpg`, file);
		assert.equal(bookmarkImage(parsed.data.image), parsed.data.image, file);
		assert.equal(parsed.data.bookmarkType, 'video', file);
		assert.equal(parsed.data.date, row?.date, file);
		assert.equal(parsed.data.sourceDate, row?.sourceDate, file);
		assert.equal(parsed.data.published, true, file);
		assert.equal(typeof parsed.data.description, 'string', file);
		assert.equal(String(parsed.data.description).length > 0, true, file);
		assert.deepEqual(normalizeTags(parsed.data.tags), ['TED'], file);
	}
	assert.equal(found.size, tedPlaylist.length);
	assert.equal(new Set(found.values()).size, tedPlaylist.length);
});
