<script lang="ts">
	import {
		formatPage,
		layoutReadingChart,
		normalizeReadingHistory,
		readingHistorySummary
	} from '$content/reading';
	import type { ReadingHistoryEntry } from '$content/types';

	let {
		history: historyProp,
		totalPages,
		title,
		inline = false
	}: {
		history: ReadingHistoryEntry[];
		totalPages?: number;
		title?: string;
		inline?: boolean;
	} = $props();

	const uid = $props.id();

	let width = $state(0);
	let root = $state<HTMLElement | undefined>();
	let open = $state(false);
	let shown = $state(false);
	let moving = $state(false);
	let pointIndex = $state<number | null>(null);
	let tabStop = $state(0);

	let history = $derived(normalizeReadingHistory(historyProp) ?? []);
	let layout = $derived(width > 0 ? layoutReadingChart(history, width, totalPages, inline) : undefined);
	let summary = $derived(readingHistorySummary(history));
	let tabIndex = $derived(history.length ? Math.min(tabStop, history.length - 1) : 0);
	let activePoint = $derived(
		layout && pointIndex !== null ? layout.points[pointIndex] : undefined
	);
	let activePercent = $derived(
		activePoint && typeof totalPages === 'number' && totalPages > 0
			? Math.round((activePoint.page / totalPages) * 100)
			: undefined
	);
	let shift = $derived.by(() => {
		if (!activePoint || !layout) return 0;
		const half = 110;
		if (activePoint.x - half < 4) return 4 - (activePoint.x - half);
		if (activePoint.x + half > layout.width - 4) return layout.width - 4 - (activePoint.x + half);
		return 0;
	});

	let hideTimer: ReturnType<typeof setTimeout> | undefined;
	let enterFrame = 0;

	function stage(element: HTMLElement) {
		root = element;
		return () => {
			root = undefined;
		};
	}

	function show(index: number) {
		clearTimeout(hideTimer);
		if (shown && open && pointIndex === index) return;
		const already = shown && open && pointIndex !== null;
		moving = already;
		pointIndex = index;
		if (!shown) {
			shown = true;
			open = false;
			cancelAnimationFrame(enterFrame);
			enterFrame = requestAnimationFrame(() => {
				open = true;
			});
			return;
		}
		open = true;
	}

	function hideNow() {
		cancelAnimationFrame(enterFrame);
		clearTimeout(hideTimer);
		moving = false;
		open = false;
	}

	function scheduleHide() {
		clearTimeout(hideTimer);
		hideTimer = setTimeout(hideNow, 70);
	}

	function nearest(event: PointerEvent) {
		if (!layout || !root) return null;
		const rect = root.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;
		let index: number | null = null;
		let best = 28;
		for (let i = 0; i < layout.points.length; i += 1) {
			const point = layout.points[i];
			const distance = Math.hypot(point.x - x, point.y - y);
			if (distance <= best) {
				index = i;
				best = distance;
			}
		}
		return index;
	}

	function focusedInside() {
		return document.activeElement instanceof Node && root?.contains(document.activeElement);
	}

	function onPointerMove(event: PointerEvent) {
		if (event.pointerType === 'touch') return;
		const index = nearest(event);
		if (index === null) {
			if (!focusedInside()) scheduleHide();
			return;
		}
		show(index);
	}

	function onStageLeave(event: PointerEvent) {
		if (event.pointerType === 'touch') return;
		if (focusedInside()) return;
		scheduleHide();
	}

	function onStagePointerUp(event: PointerEvent) {
		if (event.pointerType !== 'touch') return;
		const index = nearest(event);
		if (index === null) return;
		if (open && pointIndex === index) {
			hideNow();
			return;
		}
		show(index);
	}

	function onFocus(index: number) {
		tabStop = index;
		show(index);
	}

	function onBlur(event: FocusEvent) {
		const next = event.relatedTarget;
		if (next instanceof Node && root?.contains(next)) return;
		scheduleHide();
	}

	function onWindowPointerDown(event: PointerEvent) {
		const target = event.target;
		if (target instanceof Node && root?.contains(target)) return;
		hideNow();
	}

	function focusIndex(index: number) {
		const next = Math.max(0, Math.min(history.length - 1, index));
		tabStop = next;
		show(next);
		root?.querySelector<HTMLButtonElement>(`[data-index="${next}"]`)?.focus();
	}

	function onKeydown(event: KeyboardEvent, index: number) {
		if (event.key === 'Escape') {
			event.preventDefault();
			hideNow();
			if (event.currentTarget instanceof HTMLElement) event.currentTarget.blur();
			return;
		}
		const next: Record<string, number> = {
			ArrowRight: index + 1,
			ArrowDown: index + 1,
			ArrowLeft: index - 1,
			ArrowUp: index - 1,
			Home: 0,
			End: history.length - 1
		};
		if (!(event.key in next)) return;
		event.preventDefault();
		focusIndex(next[event.key]);
	}
</script>

<svelte:window onpointerdown={onWindowPointerDown} />

{#if history.length}
	<section class={['reading', inline && 'inline', open && 'front']} aria-labelledby="{uid}-label">
		<h2 id="{uid}-label" class={inline ? 'sr-only' : 'kicker'}>
			Reading progress
			{#if title}<span class="sr-only"> for {title}</span>{/if}
		</h2>
		<p class="sr-only">{summary}</p>
		<div
			class="stage"
			role="group"
			aria-label="Recorded days"
			bind:clientWidth={width}
			{@attach stage}
			onpointermove={onPointerMove}
			onpointerleave={onStageLeave}
			onpointerup={onStagePointerUp}
		>
			{#if layout}
				<svg
					class={inline || layout.width < 460 ? 'compact' : undefined}
					width={layout.width}
					height={layout.height}
					viewBox="0 0 {layout.width} {layout.height}"
					aria-hidden="true"
					focusable="false"
				>
					<defs>
						<linearGradient
							id="{uid}-fill"
							gradientUnits="userSpaceOnUse"
							x1="0"
							y1={layout.plot.top}
							x2="0"
							y2={layout.plot.bottom}
						>
							<stop offset="0%" stop-color="#bbdf32" stop-opacity="0.42" />
							<stop offset="55%" stop-color="#bbdf32" stop-opacity="0.12" />
							<stop offset="100%" stop-color="#bbdf32" stop-opacity="0" />
						</linearGradient>
					</defs>
					{#each layout.yTicks as tick (tick.label)}
						<line
							class={tick.label === '0' ? 'baseline acid' : 'grid'}
							x1={layout.plot.left}
							x2={layout.plot.right}
							y1={tick.y}
							y2={tick.y}
						/>
						<text class="tick" x={layout.plot.left - 8} y={tick.y} text-anchor="end">{tick.label}</text>
					{/each}
					{#each layout.xTicks as tick (`${tick.label}-${tick.x}`)}
						<text class="tick axis" x={tick.x} y={layout.plot.bottom + (inline ? 12 : 18)} text-anchor={tick.anchor}>
							{tick.label}
						</text>
					{/each}
					<g class="acid">
						{#if layout.area}
							<path d={layout.area} fill="url(#{uid}-fill)" />
						{/if}
						{#if layout.line}
							<path class="series" d={layout.line} />
						{/if}
						{#each layout.points as point, index (point.date)}
							<circle
								class={['halo', open && pointIndex === index && 'on']}
								cx={point.x}
								cy={point.y}
								r="8"
							/>
							<circle
								class={['dot', open && pointIndex === index && 'on']}
								cx={point.x}
								cy={point.y}
								r="3.25"
							/>
						{/each}
					</g>
					{#if activePoint}
						<line
							class="guide"
							x1={activePoint.x}
							x2={activePoint.x}
							y1={activePoint.y}
							y2={layout.plot.bottom}
							style:opacity={open ? 1 : 0}
						/>
					{/if}
				</svg>
				<div class="points">
					{#each layout.points as point, index (point.date)}
						<button
							type="button"
							class="hit"
							data-index={index}
							style:left="{point.x}px"
							style:top="{point.y}px"
							aria-label="{point.dateLabel}, page {formatPage(point.page)}{typeof totalPages === 'number' && totalPages > 0 ? `, ${Math.round((point.page / totalPages) * 100)} percent` : ''}"
							tabindex={index === tabIndex ? 0 : -1}
							onfocus={() => onFocus(index)}
							onblur={onBlur}
							onkeydown={(event) => onKeydown(event, index)}
						></button>
					{/each}
				</div>
				{#if shown && activePoint}
					<div
						class={['tooltip', open && 'open', activePoint.y < (inline ? 48 : 76) && 'below', moving && 'instant']}
						style:--x="{activePoint.x}px"
						style:--y="{activePoint.y}px"
						style:--shift="{shift}px"
					>
						<p class="num">
							<span class="unit">p.</span> {formatPage(activePoint.page)}
							{#if activePercent !== undefined}<span class="pct">{activePercent}%</span>{/if}
						</p>
						<p class="when">{activePoint.dateLabel}</p>
					</div>
				{/if}
			{/if}
		</div>
	</section>
{/if}

<style>
	.reading {
		position: relative;
		width: 100%;
	}

	.reading.front {
		z-index: 4;
	}

	.reading.inline .stage {
		min-height: 136px;
	}

	.kicker {
		margin: 0 0 0.75rem;
		color: #595e44;
		font-size: 0.75rem;
		font-weight: 500;
		letter-spacing: 0.14em;
		line-height: 1.2;
		text-transform: uppercase;
	}

	.stage {
		position: relative;
		width: 100%;
		min-height: 220px;
	}

	svg {
		display: block;
		overflow: visible;
	}

	.tick {
		fill: #a1a1aa;
		font-family: inherit;
		font-size: 12px;
		font-variant-numeric: tabular-nums;
		dominant-baseline: middle;
	}

	.axis {
		dominant-baseline: hanging;
	}

	svg.compact .tick {
		font-size: 11px;
	}

	.grid {
		stroke: rgba(255, 255, 255, 0.08);
		stroke-width: 1;
	}

	.baseline {
		stroke: rgba(187, 223, 50, 0.4);
		stroke-width: 1;
	}

	.acid {
		transition: opacity 180ms cubic-bezier(0.23, 1, 0.32, 1);
	}

	.series {
		fill: none;
		stroke: #bbdf32;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.guide {
		stroke: #bbdf32;
		stroke-opacity: 0.45;
		stroke-width: 1;
		transition: opacity 160ms cubic-bezier(0.23, 1, 0.32, 1);
	}

	.halo,
	.dot {
		transform-box: fill-box;
		transform-origin: center;
	}

	.halo {
		fill: #bbdf32;
		opacity: 0;
		transition: opacity 160ms ease;
	}

	.halo.on {
		opacity: 0.28;
	}

	.dot {
		fill: #bbdf32;
		stroke: #09090b;
		stroke-width: 2;
	}

	.points {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.hit {
		position: absolute;
		width: 44px;
		height: 44px;
		margin: 0;
		padding: 0;
		border: 0;
		border-radius: 999px;
		background: transparent;
		transform: translate(-50%, -50%);
		pointer-events: none;
		touch-action: manipulation;
		-webkit-tap-highlight-color: transparent;
	}

	.hit:focus-visible {
		outline: 2px solid #bbdf32;
		outline-offset: 2px;
	}

	.tooltip {
		position: absolute;
		left: 0;
		top: 0;
		z-index: 2;
		padding: 0.45rem 0.7rem 0.5rem;
		border: 1px solid rgba(187, 223, 50, 0.35);
		border-radius: 0.75rem;
		background: rgba(9, 9, 11, 0.92);
		box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
		pointer-events: none;
		opacity: 0;
		transform: translate(var(--x), var(--y)) translate(calc(-50% + var(--shift)), calc(-100% - 14px))
			scale(0.97);
		transform-origin: center bottom;
		transition:
			transform 130ms cubic-bezier(0.23, 1, 0.32, 1),
			opacity 130ms cubic-bezier(0.23, 1, 0.32, 1);
	}

	.tooltip.open {
		opacity: 1;
		transform: translate(var(--x), var(--y)) translate(calc(-50% + var(--shift)), calc(-100% - 14px)) scale(1);
		transition:
			transform 160ms cubic-bezier(0.23, 1, 0.32, 1),
			opacity 160ms cubic-bezier(0.23, 1, 0.32, 1);
	}

	.tooltip.below {
		transform: translate(var(--x), var(--y)) translate(calc(-50% + var(--shift)), 16px) scale(0.97);
		transform-origin: center top;
	}

	.tooltip.below.open {
		transform: translate(var(--x), var(--y)) translate(calc(-50% + var(--shift)), 16px) scale(1);
	}

	.tooltip.open.instant {
		transition-duration: 0ms;
	}

	.num {
		margin: 0;
		color: #bbdf32;
		font-size: 0.95rem;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		letter-spacing: -0.01em;
		line-height: 1.1;
		white-space: nowrap;
	}

	.unit {
		font-size: 0.68rem;
		font-weight: 500;
		letter-spacing: 0.04em;
		opacity: 0.8;
	}

	.pct {
		margin-left: 0.45rem;
		color: #e4e4e7;
		font-size: 0.75rem;
		font-weight: 500;
	}

	.when {
		margin: 0.2rem 0 0;
		color: #e4e4e7;
		font-size: 0.75rem;
		line-height: 1.2;
		white-space: nowrap;
	}

	@media (hover: hover) and (pointer: fine) {
		.hit {
			cursor: pointer;
		}

		.acid {
			opacity: 0.4;
		}

		.reading:hover .acid,
		.reading:focus-within .acid,
		:global(article.group:hover) .acid,
		:global(article.group:focus-within) .acid {
			opacity: 1;
		}
	}

	@media (prefers-reduced-motion: no-preference) {
		.dot {
			transition: transform 160ms ease;
		}

		.dot.on {
			transform: scale(1.45);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.acid,
		.guide,
		.halo,
		.dot {
			transition: none;
		}

		.tooltip,
		.tooltip.open,
		.tooltip.below,
		.tooltip.below.open,
		.tooltip.open.instant {
			transform: translate(var(--x), var(--y)) translate(calc(-50% + var(--shift)), calc(-100% - 14px));
			transition: opacity 120ms ease;
		}

		.tooltip.below,
		.tooltip.below.open {
			transform: translate(var(--x), var(--y)) translate(calc(-50% + var(--shift)), 16px);
		}
	}
</style>
