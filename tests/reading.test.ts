import assert from 'node:assert/strict';
import matter from 'gray-matter';
import {
	inclusiveDays,
	layoutReadingChart,
	listeningDayCount,
	normalizeListening,
	normalizeReadingHistory,
	readingDayLabel,
	readingHistorySummary,
	warsawToday
} from '../src/lib/content/reading.ts';

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

test('counts listening days inclusively from calendar dates', () => {
	assert.equal(listeningDayCount({ start: '2026-10-18', end: '2026-10-30' }), 13);
	assert.equal(listeningDayCount({ start: '2026-10-06', end: '2026-10-17' }), 12);
	assert.equal(listeningDayCount({ start: '2026-06-23', end: '2026-07-21' }), 29);
	assert.equal(listeningDayCount(normalizeListening({ start: '2026-10-18', end: '2026-10-17' })), undefined);
	assert.equal(inclusiveDays('2026-10-01', '2026-11-08'), 39);
});

test('labels a finished reading span and an open one through today', () => {
	const span = [
		{ date: '2026-10-01', page: 190 },
		{ date: '2026-11-08', page: 736 }
	];
	assert.equal(readingDayLabel(span, 'read', '2026-11-14'), 'Read in 39 days');
	assert.equal(
		readingDayLabel([{ date: '2026-11-11', page: 34 }, { date: '2026-11-13', page: 112 }], 'reading', '2026-11-14'),
		'Reading for 4 days'
	);
	assert.equal(readingDayLabel([{ date: '2026-11-01', page: 10 }], 'reading', '2026-11-14'), 'Reading for 14 days');
	assert.equal(readingDayLabel([{ date: '2018-12-01', page: 400 }], 'read', '2026-11-14'), undefined);
	assert.equal(readingDayLabel([{ date: '2026-11-14', page: 12 }], 'reading', '2026-11-14'), undefined);
	assert.equal(readingDayLabel(span, 'paused', '2026-11-14'), undefined);
	assert.equal(warsawToday(new Date('2026-11-14T23:30:00Z')), '2026-11-15');
	assert.equal(warsawToday(new Date('2026-11-14T22:30:00Z')), '2026-11-14');
});

test('describes the series without mentioning empty days as data', () => {
	assert.equal(
		readingHistorySummary(history),
		'Reading progress from January 1, 2026 to January 12, 2026, 3 recorded days. Latest page 40. Arrow keys move between recorded days.'
	);
});
