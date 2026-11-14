import type { ReadingHistoryEntry } from './types';

const DAY = 86_400_000;

const fullDateFormat = new Intl.DateTimeFormat('en-US', {
	month: 'long',
	day: 'numeric',
	year: 'numeric',
	timeZone: 'UTC'
});

const axisDateFormat = new Intl.DateTimeFormat('en-US', {
	month: 'short',
	day: 'numeric',
	timeZone: 'UTC'
});

const axisYearFormat = new Intl.DateTimeFormat('en-US', {
	month: 'short',
	day: 'numeric',
	year: 'numeric',
	timeZone: 'UTC'
});

const pageFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });

export type ReadingChartPoint = ReadingHistoryEntry & {
	time: number;
	x: number;
	y: number;
	dateLabel: string;
	axisLabel: string;
};

export type ReadingChartTick = {
	x: number;
	y: number;
	label: string;
	anchor: 'start' | 'middle' | 'end';
};

export type ReadingChartLayout = {
	width: number;
	height: number;
	plot: { left: number; right: number; top: number; bottom: number };
	yMax: number;
	points: ReadingChartPoint[];
	xTicks: ReadingChartTick[];
	yTicks: ReadingChartTick[];
	line: string;
	area: string;
};

type DatedEntry = ReadingHistoryEntry & { time: number; index: number };

export function parseCalendarDate(value: unknown): { iso: string; time: number } | undefined {
	let year: number;
	let month: number;
	let day: number;
	if (value instanceof Date) {
		if (Number.isNaN(value.getTime())) return undefined;
		year = value.getUTCFullYear();
		month = value.getUTCMonth() + 1;
		day = value.getUTCDate();
	} else if (typeof value === 'string') {
		const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value.trim());
		if (!match) return undefined;
		year = Number(match[1]);
		month = Number(match[2]);
		day = Number(match[3]);
	} else {
		return undefined;
	}
	const time = Date.UTC(year, month - 1, day);
	const check = new Date(time);
	if (check.getUTCFullYear() !== year || check.getUTCMonth() !== month - 1 || check.getUTCDate() !== day) {
		return undefined;
	}
	return {
		iso: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
		time
	};
}

function parsePage(value: unknown): number | undefined {
	const page = typeof value === 'number' ? value : typeof value === 'string' && value.trim() !== '' ? Number(value) : NaN;
	if (!Number.isFinite(page) || page < 0) return undefined;
	return page;
}

export function normalizeReadingHistory(value: unknown): ReadingHistoryEntry[] | undefined {
	if (!Array.isArray(value)) return undefined;
	const parsed: DatedEntry[] = [];
	value.forEach((item, index) => {
		if (!item || typeof item !== 'object') return;
		const record = item as Record<string, unknown>;
		const date = parseCalendarDate(record.date);
		const page = parsePage(record.page);
		if (!date || page === undefined) return;
		parsed.push({ date: date.iso, page, time: date.time, index });
	});
	parsed.sort((a, b) => a.time - b.time || a.index - b.index);
	const byDate = new Map<string, ReadingHistoryEntry>();
	for (const entry of parsed) byDate.set(entry.date, { date: entry.date, page: entry.page });
	const entries = [...byDate.values()];
	return entries.length ? entries : undefined;
}

export function formatPage(value: number): string {
	return pageFormat.format(Math.round(value * 10) / 10);
}

export function readingHistorySummary(entries: ReadingHistoryEntry[]): string {
	if (!entries.length) return '';
	const first = entries[0];
	const last = entries[entries.length - 1];
	const latest = formatPage(last.page);
	const end = fullDate(last.date);
	if (entries.length === 1) return `Reading progress on ${end}: page ${latest}.`;
	const start = fullDate(first.date);
	return `Reading progress from ${start} to ${end}, ${entries.length} recorded days. Latest page ${latest}. Arrow keys move between recorded days.`;
}

export function layoutReadingChart(
	entries: ReadingHistoryEntry[],
	width: number,
	totalPages?: number,
	inline = false
): ReadingChartLayout | undefined {
	const history = normalizeReadingHistory(entries);
	if (!history || width < (inline ? 128 : 160)) return undefined;
	const narrow = inline || width < 460;
	const height = inline ? 136 : narrow ? 220 : 252;
	const peak = Math.max(...history.map((entry) => entry.page));
	const yMax = chartCeiling(peak, totalPages);
	const yLabelWidth = Math.ceil(formatPage(yMax).length * (narrow ? 6.4 : 7.2));
	const gutter = Math.max(inline ? 24 : 28, yLabelWidth + (inline ? 10 : 14));
	const top = inline ? 8 : 16;
	const bottom = inline ? 26 : narrow ? 32 : 36;
	const plot = {
		left: gutter,
		right: width - (inline ? 8 : 22),
		top,
		bottom: height - bottom
	};
	if (plot.right - plot.left < (inline ? 36 : 48)) return undefined;
	const plotWidth = plot.right - plot.left;
	const plotHeight = plot.bottom - plot.top;
	const dated = history.map((entry) => ({ ...entry, time: parseCalendarDate(entry.date)!.time }));
	const t0 = dated[0].time;
	const t1 = dated[dated.length - 1].time;
	const span = t1 - t0;
	const spanDays = span / DAY;
	const withYear = spanDays > 340 || new Date(t0).getUTCFullYear() !== new Date(t1).getUTCFullYear();
	const xAt = (time: number) => (span === 0 ? plot.left + plotWidth / 2 : plot.left + ((time - t0) / span) * plotWidth);
	const yAt = (page: number) => plot.bottom - (Math.min(page, yMax) / yMax) * plotHeight;
	const points: ReadingChartPoint[] = dated.map((entry) => ({
		...entry,
		x: xAt(entry.time),
		y: yAt(entry.page),
		dateLabel: fullDate(entry.date),
		axisLabel: axisDate(entry.time, withYear)
	}));
	const labelWidth = withYear ? (narrow ? 72 : 88) : inline ? 44 : narrow ? 48 : 58;
	const xTicks = dateTicks(t0, t1, xAt, Math.max(2, Math.floor(plotWidth / labelWidth)), labelWidth * 0.82, withYear);
	const yTicks = pageTicks(yMax, yAt, inline || plotHeight < 150 ? 2 : 4);
	return {
		width,
		height,
		plot,
		yMax,
		points,
		xTicks,
		yTicks,
		line: points.length > 1 ? linePath(points) : '',
		area: points.length > 1 ? areaPath(points, plot.bottom) : ''
	};
}

function fullDate(iso: string) {
	const parsed = parseCalendarDate(iso);
	return parsed ? fullDateFormat.format(parsed.time) : iso;
}

function axisDate(time: number, withYear: boolean) {
	return (withYear ? axisYearFormat : axisDateFormat).format(time);
}

function chartCeiling(peak: number, totalPages?: number) {
	if (typeof totalPages === 'number' && Number.isFinite(totalPages) && totalPages > 0) {
		return Math.max(peak, totalPages);
	}
	return niceCeil(Math.max(peak, 1));
}

function niceCeil(value: number) {
	if (value <= 1) return 1;
	const exp = 10 ** Math.floor(Math.log10(value));
	const fraction = value / exp;
	const nice = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 2.5 ? 2.5 : fraction <= 5 ? 5 : 10;
	const ceil = nice * exp;
	return ceil + 1e-9 < value ? exp * 10 : ceil;
}

function pageTicks(yMax: number, yAt: (page: number) => number, maxSteps: number): ReadingChartTick[] {
	const rough = yMax / maxSteps;
	const exp = 10 ** Math.floor(Math.log10(Math.max(rough, 1)));
	const fraction = rough / exp;
	const nice = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 2.5 ? 2.5 : fraction <= 5 ? 5 : 10;
	const step = Math.max(nice * exp, 1);
	const values = [0];
	for (let value = step; value < yMax - step * 0.2; value += step) values.push(value);
	if (values[values.length - 1] !== yMax) values.push(yMax);
	return values.map((value) => ({
		x: 0,
		y: yAt(value),
		label: formatPage(value),
		anchor: 'end' as const
	}));
}

function dateTicks(
	t0: number,
	t1: number,
	xAt: (time: number) => number,
	maxTicks: number,
	minPx: number,
	withYear: boolean
): ReadingChartTick[] {
	const times = t1 <= t0 ? [t0] : [t0, ...interiorTicks(t0, t1, maxTicks), t1];
	const kept: number[] = [];
	for (const time of times) {
		if (!kept.length) {
			kept.push(time);
			continue;
		}
		if (time !== t1 && xAt(time) - xAt(kept[kept.length - 1]) < minPx) continue;
		if (time !== t1 && xAt(t1) - xAt(time) < minPx) continue;
		if (time === t1 && kept.length > 1 && xAt(time) - xAt(kept[kept.length - 1]) < minPx) kept.pop();
		kept.push(time);
	}
	return kept.map((time, index) => ({
		x: xAt(time),
		y: 0,
		label: axisDate(time, withYear),
		anchor: kept.length === 1 ? 'middle' : index === 0 ? 'start' : index === kept.length - 1 ? 'end' : 'middle'
	}));
}

function interiorTicks(t0: number, t1: number, maxTicks: number) {
	const spanDays = (t1 - t0) / DAY;
	const intervals = [1, 2, 3, 5, 7, 14, 21, 30, 60, 90, 120, 180, 365];
	let step = intervals[intervals.length - 1];
	for (const candidate of intervals) {
		if (spanDays / candidate <= maxTicks - 1) {
			step = candidate;
			break;
		}
	}
	const stride = monthStride(step);
	if (stride) {
		const ticks: number[] = [];
		const start = new Date(t0);
		let cursor = Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + stride, 1);
		while (cursor < t1) {
			if (cursor > t0) ticks.push(cursor);
			const date = new Date(cursor);
			cursor = Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + stride, 1);
		}
		return ticks;
	}
	const ticks: number[] = [];
	let cursor = t0 + step * DAY;
	while (cursor < t1) {
		ticks.push(cursor);
		cursor += step * DAY;
	}
	return ticks;
}

function monthStride(stepDays: number) {
	if (stepDays < 28) return undefined;
	if (stepDays >= 365) return 12;
	if (stepDays >= 180) return 6;
	if (stepDays >= 120) return 4;
	if (stepDays >= 90) return 3;
	if (stepDays >= 60) return 2;
	return 1;
}

function linePath(points: ReadingChartPoint[]) {
	return points.map((point, index) => `${index === 0 ? 'M' : 'L'}${round(point.x)} ${round(point.y)}`).join(' ');
}

function areaPath(points: ReadingChartPoint[], baseline: number) {
	const first = points[0];
	const last = points[points.length - 1];
	return [
		`M${round(first.x)} ${round(baseline)}`,
		...points.map((point) => `L${round(point.x)} ${round(point.y)}`),
		`L${round(last.x)} ${round(baseline)}Z`
	].join(' ');
}

function round(value: number) {
	return Math.round(value * 10) / 10;
}

const CUMULATIVE_START = Date.UTC(2016, 0, 1);

export type CumulativeBooks = {
	from: string;
	to: string;
	total: number;
	categories: string[];
	times: string[];
	values: number[][];
};

type CumulativeSource = {
	tag?: string;
	status?: string;
	date?: string;
	totalPages?: number;
	readingHistory?: ReadingHistoryEntry[] | null;
	listening?: { start?: unknown; end?: unknown } | null;
};

type ProgressAt = (time: number) => number;

export type CumulativeChartBand = {
	index: number;
	area: string;
	edge: string;
};

export type CumulativeChartSample = {
	time: number;
	dateLabel: string;
	x: number;
	total: number;
	y: number;
	bands: { index: number; value: number; top: number; bottom: number }[];
};

export type CumulativeChartLayout = {
	width: number;
	height: number;
	plot: { left: number; right: number; top: number; bottom: number };
	yMax: number;
	yTicks: ReadingChartTick[];
	xTicks: ReadingChartTick[];
	bands: CumulativeChartBand[];
	totalPath: string;
	samples: CumulativeChartSample[];
};

function utcDay(date: Date) {
	return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

function isoFromTime(time: number) {
	const date = new Date(time);
	return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
}

function spanOf(listening: CumulativeSource['listening']) {
	if (!listening || typeof listening !== 'object') return undefined;
	const start = parseCalendarDate(listening.start)?.time;
	const end = parseCalendarDate(listening.end)?.time;
	if (start == null || end == null || end < start) return undefined;
	return { start, end };
}

function progressAt(book: CumulativeSource): ProgressAt {
	const history = normalizeReadingHistory(book.readingHistory) ?? [];
	const total = book.totalPages;
	const finished = book.status === 'read' || book.status === 'listened';
	const finishedAt = parseCalendarDate(book.date)?.time;
	const dated = history
		.map((entry) => ({ page: entry.page, time: parseCalendarDate(entry.date)?.time }))
		.filter((entry): entry is { page: number; time: number } => entry.time != null);
	if (dated.length && typeof total === 'number' && Number.isFinite(total) && total > 0) {
		return (time) => {
			let page = 0;
			for (const entry of dated) {
				if (entry.time <= time) page = entry.page;
				else break;
			}
			let value = Math.min(1, Math.max(0, page / total));
			if (finished && finishedAt != null && finishedAt <= time) value = 1;
			return value;
		};
	}
	const span = spanOf(book.listening);
	if (span) {
		return (time) => {
			if (time < span.start) return 0;
			if (time >= span.end) return 1;
			return (time - span.start) / (span.end - span.start);
		};
	}
	if (finished && finishedAt != null) return (time) => (finishedAt <= time ? 1 : 0);
	return () => 0;
}

export function cumulativeBooks(books: CumulativeSource[], asOf: Date = new Date()): CumulativeBooks | undefined {
	const end = Math.max(utcDay(asOf), CUMULATIVE_START);
	const times = new Set<number>([CUMULATIVE_START, end]);
	const readers = books.map((book) => {
		const read = progressAt(book);
		const history = normalizeReadingHistory(book.readingHistory) ?? [];
		for (const entry of history) {
			const time = parseCalendarDate(entry.date)?.time;
			if (time != null) times.add(time);
		}
		const finishedAt = parseCalendarDate(book.date)?.time;
		if (finishedAt != null) times.add(finishedAt);
		const span = spanOf(book.listening);
		if (span) {
			times.add(span.start);
			times.add(span.end);
		}
		return { tag: book.tag?.trim() || 'Untagged', read };
	});
	const timeline = [...times].filter((time) => time >= CUMULATIVE_START && time <= end).sort((a, b) => a - b);
	const names = [...new Set(readers.map((book) => book.tag))];
	const rows = names.map((name) => {
		const group = readers.filter((book) => book.tag === name);
		return timeline.map((time) => Math.round(group.reduce((sum, book) => sum + book.read(time), 0) * 1000) / 1000);
	});
	const ranked = names
		.map((name, index) => ({ name, index, total: rows[index][rows[index].length - 1] ?? 0 }))
		.filter((item) => item.total > 0.0001)
		.sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));
	if (!ranked.length) return undefined;
	const values = ranked.map((item) => rows[item.index]);
	return {
		from: isoFromTime(timeline[0]),
		to: isoFromTime(timeline[timeline.length - 1]),
		total: Math.round(values.reduce((sum, row) => sum + row[row.length - 1], 0) * 10) / 10,
		categories: ranked.map((item) => item.name),
		times: timeline.map(isoFromTime),
		values
	};
}

function tickStep(rough: number) {
	const exp = 10 ** Math.floor(Math.log10(Math.max(rough, 1e-6)));
	const fraction = rough / exp;
	const nice = fraction <= 1.5 ? 1 : fraction <= 3 ? 2 : fraction <= 7 ? 5 : 10;
	return nice * exp;
}

export function layoutCumulativeChart(series: CumulativeBooks, width: number): CumulativeChartLayout | undefined {
	if (width < 280 || !series.times.length) return undefined;
	const narrow = width < 520;
	const height = narrow ? 232 : 280;
	const count = series.times.length;
	const totals = series.times.map((_, index) => series.values.reduce((sum, row) => sum + (row[index] ?? 0), 0));
	const peak = Math.max(...totals, 1);
	const step = tickStep(peak / 4);
	const yMax = Math.ceil((Math.max(peak, step) * 1.06) / step) * step;
	const label = formatPage(yMax);
	const plot = {
		left: Math.max(narrow ? 36 : 48, Math.ceil(label.length * (narrow ? 6.6 : 7.2)) + (narrow ? 10 : 14)),
		right: width - (narrow ? 4 : 8),
		top: 12,
		bottom: height - (narrow ? 26 : 32)
	};
	if (plot.right - plot.left < 48) return undefined;
	const dated = series.times.map((iso) => parseCalendarDate(iso)?.time).filter((time): time is number => time != null);
	if (dated.length !== count) return undefined;
	const t0 = dated[0];
	const t1 = dated[count - 1];
	const span = Math.max(1, t1 - t0);
	const plotWidth = plot.right - plot.left;
	const plotHeight = plot.bottom - plot.top;
	const xAt = (time: number) => plot.left + ((time - t0) / span) * plotWidth;
	const yAt = (value: number) => plot.bottom - (value / yMax) * plotHeight;
	const yTicks = [0];
	for (let value = step; value < yMax - step * 0.01; value += step) yTicks.push(round(value));
	if (yTicks[yTicks.length - 1] !== yMax) yTicks.push(yMax);
	const startYear = new Date(t0).getUTCFullYear();
	const endYear = new Date(t1).getUTCFullYear();
	const slots = Math.max(3, Math.floor(plotWidth / (narrow ? 64 : 84)));
	const stride = Math.max(1, Math.ceil((endYear - startYear) / Math.max(1, slots - 1)));
	const years = [];
	for (let year = startYear; year <= endYear; year += stride) years.push(year);
	if (years[years.length - 1] !== endYear) years.push(endYear);
	const xTicks: ReadingChartTick[] = [];
	let previous = -Infinity;
	years.forEach((year, index) => {
		const last = index === years.length - 1;
		const time = index === 0 ? t0 : last ? t1 : Math.min(t1, Math.max(t0, Date.UTC(year, 0, 1)));
		const x = xAt(time);
		if (!last && x - previous < (narrow ? 40 : 52)) return;
		if (last && xTicks.length > 1 && x - previous < (narrow ? 36 : 46)) xTicks.pop();
		previous = x;
		xTicks.push({
			x,
			y: 0,
			label: String(year),
			anchor: index === 0 ? 'start' : last ? 'end' : 'middle'
		});
	});
	const xs = dated.map(xAt);
	const lows = series.values.map(() => Array<number>(count).fill(0));
	const highs = series.values.map(() => Array<number>(count).fill(0));
	const running = Array<number>(count).fill(0);
	for (let category = 0; category < series.values.length; category += 1) {
		for (let index = 0; index < count; index += 1) {
			lows[category][index] = running[index];
			running[index] += series.values[category][index] ?? 0;
			highs[category][index] = running[index];
		}
	}
	const line = (ys: number[]) => ys.map((value, index) => `${index === 0 ? 'M' : 'L'}${round(xs[index])} ${round(yAt(value))}`).join('');
	const bands = series.values.flatMap((row, index) => {
		if (!row.some((value) => value > 0.0001)) return [];
		return [{ index, edge: line(highs[index]), area: `${line(highs[index])}${[...lows[index]].reverse().map((value, offset) => `L${round(xs[count - 1 - offset])} ${round(yAt(value))}`).join('')}Z` }];
	});
	return {
		width,
		height,
		plot,
		yMax,
		yTicks: yTicks.map((value) => ({ x: 0, y: yAt(value), label: formatPage(value), anchor: 'end' as const })),
		xTicks,
		bands,
		totalPath: line(totals),
		samples: dated.map((time, index) => ({
			time,
			dateLabel: fullDate(series.times[index]),
			x: xs[index],
			total: totals[index],
			y: yAt(totals[index]),
			bands: series.categories.flatMap((_, category) => {
				const value = series.values[category][index] ?? 0;
				if (value <= 0.0001) return [];
				return [{ index: category, value, top: yAt(highs[category][index]), bottom: yAt(lows[category][index]) }];
			})
		}))
	};
}
