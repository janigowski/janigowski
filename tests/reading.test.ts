import assert from 'node:assert/strict';
import matter from 'gray-matter';
import { cumulativeBooks, layoutCumulativeChart, layoutReadingChart, normalizeReadingHistory, readingHistorySummary } from '../src/lib/content/reading.ts';

function test(name: string, fn: () => void) {
	try {
		fn();
		console.log(`ok ${name}`);
	} catch (error) {
		console.error(`fail ${name}`);
		throw error;
	}
}

const history = [
	{ date: '2026-01-01', page: 10 },
	{ date: '2026-01-02', page: 20 },
	{ date: '2026-01-12', page: 40 }
];

test('parses readingHistory frontmatter without filling missing days', () => {
	const parsed = matter(`---
readingHistory:
  - date: 2026-11-13
    page: 112
  - date: 2026-11-01
    page: 40
  - date: 2026-11-20
    page: 80
---
`);
	assert.deepEqual(normalizeReadingHistory(parsed.data.readingHistory), [
		{ date: '2026-11-01', page: 40 },
		{ date: '2026-11-13', page: 112 },
		{ date: '2026-11-20', page: 80 }
	]);
});

test('keeps quoted dates and the last entry for a repeated day', () => {
	assert.deepEqual(
		normalizeReadingHistory([
			{ date: '2026-03-02', page: 4 },
			{ date: '2026-02-31', page: 9 },
			{ date: 'nope', page: 2 },
			{ date: '2026-03-02', page: 11 },
			{ date: '2026-03-01', page: -3 },
			{ date: '2026-03-04', page: '18' }
		]),
		[
			{ date: '2026-03-02', page: 11 },
			{ date: '2026-03-04', page: 18 }
		]
	);
});

test('reads YAML date objects as the calendar day', () => {
	assert.deepEqual(normalizeReadingHistory([{ date: new Date(Date.UTC(2026, 10, 13)), page: 112 }]), [
		{ date: '2026-11-13', page: 112 }
	]);
});

test('drops empty history', () => {
	assert.equal(normalizeReadingHistory(undefined), undefined);
	assert.equal(normalizeReadingHistory([]), undefined);
	assert.equal(normalizeReadingHistory([{ date: 'yesterday', page: 1 }]), undefined);
});

test('spaces points by elapsed time and does not invent dates', () => {
	const layout = layoutReadingChart(history, 720);
	assert.ok(layout);
	assert.equal(layout.points.length, 3);
	assert.deepEqual(
		layout.points.map((point) => point.date),
		history.map((entry) => entry.date)
	);
	const day = layout.points[1].x - layout.points[0].x;
	const gap = layout.points[2].x - layout.points[1].x;
	assert.ok(Math.abs(gap / day - 10) < 0.02);
	assert.equal(layout.points[0].x, layout.plot.left);
	assert.equal(layout.points[2].x, layout.plot.right);
	assert.ok(layout.points[2].y < layout.points[0].y);
});

test('uses the book length as the vertical ceiling', () => {
	const layout = layoutReadingChart([{ date: '2026-01-01', page: 50 }], 640, 100);
	assert.ok(layout);
	assert.equal(layout.yMax, 100);
	assert.equal(layout.points.length, 1);
	assert.equal(layout.line, '');
	assert.equal(layout.area, '');
	const mid = (layout.plot.top + layout.plot.bottom) / 2;
	assert.ok(Math.abs(layout.points[0].y - mid) < 0.2);
	assert.ok(Math.abs(layout.points[0].x - (layout.plot.left + layout.plot.right) / 2) < 0.2);
});

test('keeps a page past totalPages on the chart', () => {
	const layout = layoutReadingChart(
		[
			{ date: '2026-01-01', page: 0 },
			{ date: '2026-01-10', page: 80 }
		],
		640,
		40
	);
	assert.ok(layout);
	assert.equal(layout.yMax, 80);
	assert.ok(Math.abs(layout.points[0].y - layout.plot.bottom) < 0.2);
	assert.ok(Math.abs(layout.points[1].y - layout.plot.top) < 0.2);
});

test('places axis dates on the real timeline', () => {
	const layout = layoutReadingChart(history, 720);
	assert.ok(layout);
	const ticks = layout.xTicks;
	assert.equal(ticks[0].label, 'Jan 1');
	assert.equal(ticks[ticks.length - 1].label, 'Jan 12');
	assert.equal(ticks[0].x, layout.plot.left);
	assert.equal(ticks[ticks.length - 1].x, layout.plot.right);
	for (let index = 1; index < ticks.length; index += 1) {
		assert.ok(ticks[index].x > ticks[index - 1].x);
	}
	const jan7 = Date.UTC(2026, 0, 7);
	const start = Date.UTC(2026, 0, 1);
	const end = Date.UTC(2026, 0, 12);
	const expected = layout.plot.left + ((jan7 - start) / (end - start)) * (layout.plot.right - layout.plot.left);
	const tick = ticks.find((item) => item.label === 'Jan 7');
	assert.ok(tick);
	assert.ok(Math.abs(tick.x - expected) < 0.2);
});

test('counts finished books from 2016 and keeps earlier ones in the opening total', () => {
	const series = cumulativeBooks(
		[
			{ tag: 'Technology', status: 'read', date: '2014-06-01' },
			{ tag: 'Technology', status: 'read', date: '2018-03-01' },
			{ tag: 'History', status: 'listened', date: '2020-01-01' }
		],
		new Date('2020-06-01T12:00:00Z')
	);
	assert.ok(series);
	assert.equal(series.from, '2016-01-01');
	assert.equal(series.to, '2020-06-01');
	assert.deepEqual(series.categories, ['Technology', 'History']);
	assert.equal(series.values[0][0], 1);
	assert.equal(series.values[0][series.values[0].length - 1], 2);
	assert.equal(series.values[1][series.values[1].length - 1], 1);
	assert.equal(series.total, 3);
	const layout = layoutCumulativeChart(series, 800);
	assert.ok(layout);
	assert.equal(layout.xTicks[0].label, '2016');
	assert.equal(layout.xTicks[layout.xTicks.length - 1].label, '2020');
});

test('counts an open book as the fraction of pages logged', () => {
	const series = cumulativeBooks(
		[
			{
				tag: 'Health',
				status: 'reading',
				totalPages: 100,
				readingHistory: [
					{ date: '2024-01-01', page: 25 },
					{ date: '2024-02-01', page: 40 }
				]
			}
		],
		new Date('2024-03-01T00:00:00Z')
	);
	assert.equal(series?.values[0][series.values[0].length - 1], 0.4);
	const before = series?.times.indexOf('2024-01-01') ?? -1;
	assert.equal(series?.values[0][before], 0.25);
});

test('finishes a logged book at its completion date when the page log stops short', () => {
	const series = cumulativeBooks(
		[
			{
				tag: 'Business',
				status: 'read',
				date: '2026-05-15',
				totalPages: 336,
				readingHistory: [{ date: '2026-04-02', page: 193 }]
			}
		],
		new Date('2026-06-01T00:00:00Z')
	);
	const mid = series?.times.indexOf('2026-04-02') ?? -1;
	const done = series?.times.indexOf('2026-05-15') ?? -1;
	assert.ok(Math.abs((series?.values[0][mid] ?? 0) - 193 / 336) < 0.001);
	assert.equal(series?.values[0][done], 1);
});

test('ramps a listening span and ignores a book that has no span', () => {
	const series = cumulativeBooks(
		[
			{
				tag: 'History',
				status: 'listened',
				date: '2026-06-30',
				listening: { start: '2026-06-23', end: '2026-07-21' }
			},
			{ tag: 'Science', status: 'listening', date: '2026-11-04' },
			{ tag: 'Travel', status: 'listened', date: '2026-10-17', listening: { start: 'nope' } }
		],
		new Date('2026-11-14T00:00:00Z')
	);
	assert.deepEqual(series?.categories, ['History', 'Travel']);
	const start = series?.times.indexOf('2026-06-23') ?? -1;
	const end = series?.times.indexOf('2026-07-21') ?? -1;
	assert.equal(series?.values[0][start], 0);
	assert.equal(series?.values[0][end], 1);
	assert.equal(series?.values[1][series.values[1].length - 1], 1);
});

test('describes the series without mentioning empty days as data', () => {
	assert.equal(
		readingHistorySummary(history),
		'Reading progress from January 1, 2026 to January 12, 2026, 3 recorded days. Latest page 40. Arrow keys move between recorded days.'
	);
});
