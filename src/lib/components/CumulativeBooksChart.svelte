<script lang="ts">
	import { layoutCumulativeChart, type CumulativeBooks } from '$content/reading';

	let { series }: { series: CumulativeBooks } = $props();

	const colors = [
		'#bbdf32',
		'#6831de',
		'#e2c15a',
		'#e07a5f',
		'#8eb6ff',
		'#d931de',
		'#5ec8c5',
		'#c4b5fd',
		'#f4a261',
		'#fb7185',
		'#fde68a',
		'#7dd3fc',
		'#d4d4d8',
		'#86efac',
		'#a8a29e'
	];

	const uid = $props.id();

	let width = $state(0);
	let stage = $state<HTMLElement | undefined>();
	let tipWidth = $state(180);
	let hot = $state<number | null>(null);
	let pinned = $state<number | null>(null);
	let sampleIndex = $state<number | null>(null);
	let moving = $state(false);
	let intro = $state(true);

	let layout = $derived(width > 0 ? layoutCumulativeChart(series, width) : undefined);
	let sample = $derived.by(() => {
		if (!layout || sampleIndex === null) return undefined;
		const index = Math.max(0, Math.min(sampleIndex, layout.samples.length - 1));
		return layout.samples[index];
	});
	let activeBand = $derived(sample && hot !== null ? sample.bands.find((band) => band.index === hot) : undefined);
	let pointY = $derived(activeBand ? activeBand.top : sample?.y);
	let pointValue = $derived(activeBand ? activeBand.value : sample?.total);
	let shift = $derived.by(() => {
		if (!sample || !layout) return 0;
		const half = tipWidth / 2;
		if (sample.x - half < 4) return 4 - (sample.x - half);
		if (sample.x + half > layout.width - 4) return layout.width - 4 - (sample.x + half);
		return 0;
	});
	let summary = $derived(
		series.categories
			.map((name, index) => `${name} ${formatCount(series.values[index]?.at(-1) ?? 0)}`)
			.join(', ')
	);

	function color(index: number) {
		return colors[index % colors.length];
	}

	function formatCount(value: number) {
		const rounded = Math.round(value * 10) / 10;
		return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
	}

	function unit(value: number) {
		return Math.round(value * 10) / 10 === 1 ? 'book' : 'books';
	}

	function place(stageElement: HTMLElement) {
		stage = stageElement;
		return () => {
			stage = undefined;
		};
	}

	function nearest(event: PointerEvent) {
		if (!layout || !stage) return null;
		const rect = stage.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;
		let index = 0;
		let best = Infinity;
		for (let i = 0; i < layout.samples.length; i += 1) {
			const distance = Math.abs(layout.samples[i].x - x);
			if (distance < best) {
				best = distance;
				index = i;
			}
		}
		const hit = layout.samples[index];
		let inside: number | null = null;
		let edgeIndex: number | null = null;
		let edge = 14;
		for (const band of hit.bands) {
			const top = Math.min(band.top, band.bottom);
			const bottom = Math.max(band.top, band.bottom);
			if (y >= top && y <= bottom) inside = band.index;
			const distance = Math.abs(y - band.top);
			if (distance < edge) {
				edge = distance;
				edgeIndex = band.index;
			}
		}
		return { index, category: inside ?? edgeIndex };
	}

	function show(index: number, category: number | null) {
		moving = sampleIndex !== null;
		sampleIndex = index;
		hot = category;
	}

	function restore() {
		moving = false;
		hot = pinned;
		sampleIndex = pinned === null || !layout ? null : layout.samples.length - 1;
	}

	function onPointerMove(event: PointerEvent) {
		if (event.pointerType === 'touch') return;
		const hit = nearest(event);
		if (!hit) return;
		show(hit.index, hit.category ?? pinned);
	}

	function onPointerLeave(event: PointerEvent) {
		if (event.pointerType === 'touch') return;
		restore();
	}

	function onPointerUp(event: PointerEvent) {
		if (event.pointerType !== 'touch') return;
		const hit = nearest(event);
		if (!hit) return;
		if (sampleIndex === hit.index && hot === hit.category) {
			restore();
			return;
		}
		show(hit.index, hit.category);
	}

	function onChipEnter(index: number) {
		moving = sampleIndex !== null;
		hot = index;
		sampleIndex = sampleIndex ?? (layout ? layout.samples.length - 1 : 0);
	}

	function onChipLeave() {
		if (pinned === hot) return;
		restore();
	}

	function onChipClick(index: number) {
		pinned = pinned === index ? null : index;
		hot = pinned;
		sampleIndex = pinned === null ? null : (sampleIndex ?? (layout ? layout.samples.length - 1 : 0));
		moving = false;
	}
</script>

<section class="cumulative" aria-labelledby="{uid}-title">
	<p class="kicker">Cumulative</p>
	<h2 id="{uid}-title">Reading and listening</h2>
	<p class="lede">
		A finished book counts as 1, whether it was read or heard. A book still open counts as the share of its pages
		already logged, or the share of its listening span that has passed.
	</p>
	<p class="figure"><b>{formatCount(series.total)}</b><span>Books</span></p>
	<p class="chart-label">Books</p>
	<p class="chart-note">Reads and listens on one scale, stacked by category. The axis starts in 2016.</p>
	<p class="sr-only">{formatCount(series.total)} books from 2016 through {series.to}. {summary}.</p>
	<div
		class={['stage', hot !== null && 'is-hot']}
		role="group"
		aria-label="Cumulative books by category"
		bind:clientWidth={width}
		{@attach place}
		onpointermove={onPointerMove}
		onpointerleave={onPointerLeave}
		onpointerup={onPointerUp}
	>
		{#if layout}
			<svg
				class={layout.width < 520 ? 'compact' : undefined}
				width={layout.width}
				height={layout.height}
				viewBox="0 0 {layout.width} {layout.height}"
				aria-hidden="true"
				focusable="false"
			>
				<g class={['series', intro && 'intro']} onanimationend={() => (intro = false)}>
					{#each layout.yTicks as tick (tick.label)}
						<line
							class={tick.label === '0' ? 'baseline' : 'grid'}
							x1={layout.plot.left}
							x2={layout.plot.right}
							y1={tick.y}
							y2={tick.y}
						/>
						<text class="tick" x={layout.plot.left - 8} y={tick.y} text-anchor="end">{tick.label}</text>
					{/each}
					{#each layout.bands as band (`${band.index}`)}
						<path class={['band', hot === band.index && 'on']} d={band.area} fill={color(band.index)} />
						<path class={['edge', hot === band.index && 'on']} d={band.edge} stroke={color(band.index)} />
					{/each}
					<path class="total" d={layout.totalPath} />
					{#if sample && pointY !== undefined}
						<line class="guide" x1={sample.x} x2={sample.x} y1={pointY} y2={layout.plot.bottom} />
						<circle class="halo on" cx={sample.x} cy={pointY} r="8" fill={hot === null ? '#bbdf32' : color(hot)} />
						<circle class="dot on" cx={sample.x} cy={pointY} r="3.25" fill={hot === null ? '#bbdf32' : color(hot)} />
					{/if}
					{#each layout.xTicks as tick (`${tick.label}-${tick.x}`)}
						<text class="tick axis" x={tick.x} y={layout.plot.bottom + (layout.width < 520 ? 11 : 16)} text-anchor={tick.anchor}>
							{tick.label}
						</text>
					{/each}
				</g>
			</svg>
			{#if sample && pointY !== undefined && pointValue !== undefined}
				<div
					class={['tooltip', 'open', pointY < 68 && 'below', moving && 'instant']}
					style:--x="{sample.x}px"
					style:--y="{pointY}px"
					style:--shift="{shift}px"
					bind:clientWidth={tipWidth}
				>
					<p class="num">{formatCount(pointValue)}<span class="unit"> {unit(pointValue)}</span></p>
					<p class="when">
						{#if hot !== null}<i style:--c={color(hot)}></i>{series.categories[hot]} · {/if}{sample.dateLabel}
					</p>
				</div>
			{/if}
		{/if}
	</div>
	<div class="legend">
		{#each series.categories as name, index (name)}
			<button
				type="button"
				class={['chip', hot === index && 'on']}
				aria-pressed={hot === index}
				style:--c={color(index)}
				onpointerenter={(event) => {
					if (event.pointerType !== 'touch') onChipEnter(index);
				}}
				onpointerleave={(event) => {
					if (event.pointerType !== 'touch') onChipLeave();
				}}
				onclick={() => onChipClick(index)}
			>
				<i></i>{name}
			</button>
		{/each}
	</div>
</section>

<style>
	.cumulative {
		margin: 0 0 4rem;
	}

	.kicker,
	.chart-label {
		margin: 0;
		color: #595e44;
		font-size: 0.75rem;
		font-weight: 500;
		letter-spacing: 0.14em;
		line-height: 1.2;
		text-transform: uppercase;
	}

	h2 {
		margin: 0.7rem 0 0;
		color: #fff;
		font-size: 1.35rem;
		font-weight: 500;
		letter-spacing: -0.02em;
	}

	.lede,
	.chart-note {
		max-width: 42rem;
		margin: 0.7rem 0 0;
		color: #a1a1aa;
		font-size: 0.95rem;
		line-height: 1.55;
	}

	.chart-note {
		margin-top: 0.35rem;
		font-size: 0.8125rem;
	}

	.chart-label {
		margin-top: 0.25rem;
	}

	.figure {
		display: flex;
		flex-direction: column;
		margin: 1.5rem 0 1.25rem;
	}

	.figure b {
		color: #bbdf32;
		font-family: var(--font-display), ui-sans-serif, system-ui, sans-serif;
		font-size: clamp(2.15rem, 4vw, 3.5rem);
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		letter-spacing: -0.03em;
		line-height: 0.95;
	}

	.figure span {
		margin-top: 0.55rem;
		color: #595e44;
		font-size: 0.95rem;
		font-weight: 500;
	}

	.stage {
		position: relative;
		width: 100%;
		min-height: 232px;
		margin-top: 0.85rem;
		touch-action: pan-y;
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

	.band {
		fill-opacity: 0.3;
		transition: fill-opacity 180ms cubic-bezier(0.23, 1, 0.32, 1);
	}

	.edge {
		fill: none;
		stroke-width: 1.25;
		stroke-opacity: 0.42;
		stroke-linejoin: round;
		stroke-linecap: round;
		transition:
			stroke-opacity 180ms cubic-bezier(0.23, 1, 0.32, 1),
			stroke-width 180ms cubic-bezier(0.23, 1, 0.32, 1);
	}

	.total {
		fill: none;
		stroke: #bbdf32;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
		opacity: 0.92;
		transition: opacity 180ms cubic-bezier(0.23, 1, 0.32, 1);
	}

	.stage.is-hot .band {
		fill-opacity: 0.08;
	}

	.stage.is-hot .edge {
		stroke-opacity: 0.12;
	}

	.stage.is-hot .total {
		opacity: 0.28;
	}

	.stage.is-hot .band.on {
		fill-opacity: 0.92;
	}

	.stage.is-hot .edge.on {
		stroke-opacity: 1;
		stroke-width: 2;
	}

	.guide {
		stroke: #bbdf32;
		stroke-opacity: 0.45;
		stroke-width: 1;
	}

	.halo,
	.dot {
		transform-box: fill-box;
		transform-origin: center;
	}

	.halo {
		opacity: 0.28;
	}

	.dot {
		stroke: #09090b;
		stroke-width: 2;
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.15rem 0.2rem;
		margin-top: 0.35rem;
	}

	.chip {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		margin: 0;
		padding: 0.32rem 0.55rem;
		border: 0;
		border-radius: 999px;
		background: transparent;
		color: #a1a1aa;
		font: inherit;
		font-size: 0.75rem;
		line-height: 1;
		cursor: pointer;
		transition:
			color 180ms cubic-bezier(0.23, 1, 0.32, 1),
			background 180ms cubic-bezier(0.23, 1, 0.32, 1);
	}

	.chip i,
	.when i {
		width: 0.45rem;
		height: 0.45rem;
		border-radius: 999px;
		background: var(--c);
		opacity: 0.45;
		transition:
			opacity 180ms cubic-bezier(0.23, 1, 0.32, 1),
			transform 180ms cubic-bezier(0.23, 1, 0.32, 1);
	}

	.chip:hover,
	.chip.on,
	.chip:focus-visible {
		color: #f4f4f5;
		background: rgba(255, 255, 255, 0.04);
	}

	.chip:hover i,
	.chip.on i,
	.when i {
		opacity: 1;
	}

	.chip.on i {
		transform: scale(1.2);
	}

	.chip:focus-visible {
		outline: 2px solid #bbdf32;
		outline-offset: 2px;
	}

	.tooltip {
		position: absolute;
		z-index: 2;
		padding: 0.45rem 0.7rem 0.5rem;
		border: 1px solid rgba(187, 223, 50, 0.35);
		border-radius: 0.75rem;
		background: rgba(9, 9, 11, 0.92);
		box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
		pointer-events: none;
		opacity: 0;
		transform: translate(var(--x), var(--y)) translate(calc(-50% + var(--shift)), calc(-100% - 14px)) scale(0.97);
		transform-origin: center bottom;
		transition:
			transform 160ms cubic-bezier(0.23, 1, 0.32, 1),
			opacity 160ms cubic-bezier(0.23, 1, 0.32, 1);
	}

	.tooltip.open {
		opacity: 1;
		transform: translate(var(--x), var(--y)) translate(calc(-50% + var(--shift)), calc(-100% - 14px)) scale(1);
	}

	.tooltip.below {
		transform: translate(var(--x), var(--y)) translate(calc(-50% + var(--shift)), 16px) scale(0.97);
		transform-origin: center top;
	}

	.tooltip.below.open {
		transform: translate(var(--x), var(--y)) translate(calc(-50% + var(--shift)), 16px) scale(1);
	}

	.tooltip.instant,
	.tooltip.instant.open,
	.tooltip.below.instant,
	.tooltip.below.instant.open {
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

	.when {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		margin: 0.22rem 0 0;
		color: #e4e4e7;
		font-size: 0.75rem;
		line-height: 1.2;
		white-space: nowrap;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	@media (min-width: 520px) {
		.stage {
			min-height: 280px;
		}
	}

	@media (prefers-reduced-motion: no-preference) {
		.series.intro {
			clip-path: inset(0 100% 0 0);
			animation: wipe 880ms cubic-bezier(0.23, 1, 0.32, 1) both;
		}

		.dot {
			transition: transform 160ms cubic-bezier(0.23, 1, 0.32, 1);
		}

		.dot.on {
			transform: scale(1.45);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.band,
		.edge,
		.total,
		.chip,
		.chip i {
			transition: none;
		}

		.tooltip,
		.tooltip.open,
		.tooltip.below,
		.tooltip.below.open,
		.tooltip.instant,
		.tooltip.instant.open,
		.tooltip.below.instant,
		.tooltip.below.instant.open {
			transform: translate(var(--x), var(--y)) translate(calc(-50% + var(--shift)), calc(-100% - 14px));
			transition: opacity 120ms ease;
		}

		.tooltip.below,
		.tooltip.below.open,
		.tooltip.below.instant,
		.tooltip.below.instant.open {
			transform: translate(var(--x), var(--y)) translate(calc(-50% + var(--shift)), 16px);
		}
	}

	@keyframes wipe {
		to {
			clip-path: inset(0 0 0 0);
		}
	}
</style>
