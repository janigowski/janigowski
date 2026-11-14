import type { ListeningSpan, ReadingHistoryEntry } from './types';

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

export function normalizeListening(value: unknown): ListeningSpan | undefined {
	if (!value || typeof value !== 'object') return undefined;
	const record = value as Record<string, unknown>;
	const start = parseCalendarDate(record.start);
	const end = parseCalendarDate(record.end);
	if (!start || !end || end.time < start.time) return undefined;
	return { start: start.iso, end: end.iso };
}

export function inclusiveDays(startIso: string, endIso: string): number | undefined {
	const start = parseCalendarDate(startIso);
	const end = parseCalendarDate(endIso);
	if (!start || !end || end.time < start.time) return undefined;
	return Math.round((end.time - start.time) / DAY) + 1;
}

export function warsawToday(now = new Date()): string {
	const formatted = new Intl.DateTimeFormat('en-CA', {
		timeZone: 'Europe/Warsaw',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	}).format(now);
	return parseCalendarDate(formatted)?.iso ?? formatted.slice(0, 10);
}

export function listeningDayCount(listening?: ListeningSpan): number | undefined {
	const span = normalizeListening(listening);
	if (!span) return undefined;
	return inclusiveDays(span.start, span.end);
}

export function readingDayLabel(
	entries: ReadingHistoryEntry[] | undefined,
	status: string,
	today = warsawToday()
): string | undefined {
	if (status !== 'read' && status !== 'reading') return undefined;
	const history = normalizeReadingHistory(entries);
	if (!history) return undefined;
	const end = status === 'read' ? history[history.length - 1].date : today;
	const days = inclusiveDays(history[0].date, end);
	if (days === undefined || days < 2) return undefined;
	if (status === 'reading') return `Reading for ${days} days`;
	return `Read in ${days} days`;
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
	const labelSlot = withYear ? (narrow ? 84 : 100) : narrow ? 52 : 64;
	const xTicks = dateTicks(
		t0,
		t1,
		xAt,
		Math.max(2, Math.floor(plotWidth / labelSlot)),
		withYear,
		narrow
	);
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

const AXIS_LABEL_GAP = 8;

export function axisLabelWidth(label: string, compact: boolean) {
	return Math.ceil(label.length * (compact ? 6.8 : 7.4));
}

function labelBounds(x: number, anchor: ReadingChartTick['anchor'], width: number): [number, number] {
	if (anchor === 'start') return [x, x + width];
	if (anchor === 'end') return [x - width, x];
	return [x - width / 2, x + width / 2];
}

function labelsCollide(
	a: { x: number; anchor: ReadingChartTick['anchor']; width: number },
	b: { x: number; anchor: ReadingChartTick['anchor']; width: number }
) {
	const [a0, a1] = labelBounds(a.x, a.anchor, a.width);
	const [b0, b1] = labelBounds(b.x, b.anchor, b.width);
	return a0 < b1 + AXIS_LABEL_GAP && b0 < a1 + AXIS_LABEL_GAP;
}

function dateTicks(
	t0: number,
	t1: number,
	xAt: (time: number) => number,
	maxTicks: number,
	withYear: boolean,
	compact: boolean
): ReadingChartTick[] {
	const place = (time: number, anchor: ReadingChartTick['anchor']) => {
		const label = axisDate(time, withYear);
		return { time, x: xAt(time), label, anchor, width: axisLabelWidth(label, compact) };
	};
	if (t1 <= t0) {
		const only = place(t0, 'middle');
		return [{ x: only.x, y: 0, label: only.label, anchor: only.anchor }];
	}
	const first = place(t0, 'start');
	const last = place(t1, 'end');
	const kept = [first];
	for (const time of interiorTicks(t0, t1, Math.max(maxTicks * 3, maxTicks + 4))) {
		const tick = place(time, 'middle');
		if (kept.some((item) => labelsCollide(item, tick)) || labelsCollide(tick, last)) continue;
		kept.push(tick);
	}
	kept.push(last);
	return kept.map(({ x, label, anchor }) => ({ x, y: 0, label, anchor }));
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
