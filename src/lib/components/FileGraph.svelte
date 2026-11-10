<script lang="ts">
	type NodeKind = 'code' | 'test' | 'mock';

	type GraphNode = {
		id: string;
		folder?: string;
		file: string;
		kind: NodeKind;
		column: number;
		row: number;
		lines?: number;
	};

	type GraphEdge = {
		from: string;
		to: string;
	};

	type Props = {
		nodes: GraphNode[];
		edges: GraphEdge[];
		caption?: string;
		label?: string;
		importsFromApp?: number;
		importsBack?: number;
		compact?: boolean;
	};

	let {
		nodes,
		edges,
		caption,
		label,
		importsFromApp,
		importsBack,
		compact = false
	}: Props = $props();

	const kindLabel: Record<NodeKind, string> = {
		code: 'Code',
		test: 'Test',
		mock: 'Test mock'
	};

	let rowCount = $derived(Math.max(1, ...nodes.map((node) => node.row)));
	let columnCount = $derived(Math.max(1, ...nodes.map((node) => node.column)));
	let template = $derived(
		Array.from({ length: columnCount }, (_, index) =>
			index === columnCount - 1 ? 'minmax(0,1fr)' : 'minmax(0,1fr) 2.75rem'
		).join(' ')
	);
	let byId = $derived(Object.fromEntries(nodes.map((node) => [node.id, node])));
	let targets = $derived(new Set(edges.map((edge) => edge.to)));
	let importsOf = $derived.by(() => {
		const map: Record<string, string[]> = {};
		for (const edge of edges) {
			const target = byId[edge.to];
			if (!target) continue;
			map[edge.from] = [...(map[edge.from] ?? []), target.file];
		}
		return map;
	});
	let gaps = $derived.by(() => {
		const grouped: { column: number; lines: { fromRow: number; toRow: number; key: string }[] }[] = [];
		for (const edge of edges) {
			const source = byId[edge.from];
			const target = byId[edge.to];
			if (!source || !target || target.column !== source.column + 1) continue;
			let group = grouped.find((item) => item.column === source.column);
			if (!group) {
				group = { column: source.column, lines: [] };
				grouped.push(group);
			}
			group.lines.push({
				fromRow: source.row,
				toRow: target.row,
				key: `${edge.from}-${edge.to}`
			});
		}
		return grouped;
	});
	let showBoundary = $derived(importsFromApp !== undefined || importsBack !== undefined);
	let kinds = $derived(new Set(nodes.map((node) => node.kind)));

	function edgePath(fromRow: number, toRow: number) {
		const y1 = ((fromRow - 0.5) / rowCount) * 100;
		const y2 = ((toRow - 0.5) / rowCount) * 100;
		if (Math.abs(y1 - y2) < 0.01) return `M 0 ${y1} L 100 ${y2}`;
		return `M 0 ${y1} C 55 ${y1}, 45 ${y2}, 100 ${y2}`;
	}

	function fileParts(file: string) {
		const pieces = file.split('.');
		if (pieces.length < 2) return [file];
		const extension = pieces.pop() ?? '';
		const head = pieces.map((piece) => `${piece}.`);
		head[head.length - 1] = `${head[head.length - 1]}${extension}`;
		return head;
	}
</script>

<figure class={['graph not-prose my-8', compact && 'compact']}>
	<div class="frame">
		{#if label}
			<p class="kicker">{label}</p>
		{/if}
		<div
			class="board"
			style:--template={template}
			style:--rows={rowCount}
		>
			{#each gaps as gap (gap.column)}
				<svg
					class="edges"
					style:grid-column={gap.column * 2}
					style="grid-row: 1 / -1"
					viewBox="0 0 100 100"
					preserveAspectRatio="none"
					aria-hidden="true"
				>
					{#each gap.lines as line (line.key)}
						<path d={edgePath(line.fromRow, line.toRow)} />
					{/each}
				</svg>
			{/each}
			{#each nodes as node (node.id)}
				<div
					class={['node', node.kind, targets.has(node.id) && 'target']}
					style:grid-column={node.column * 2 - 1}
					style:grid-row={node.row}
				>
					<p class="kind">{kindLabel[node.kind]}</p>
					{#if node.folder}
						<p class="folder">{node.folder}/</p>
					{/if}
					<p class="file">
						{#each fileParts(node.file) as part, index (`${part}-${index}`)}
							{#if index > 0}<wbr />{/if}{part}
						{/each}
					</p>
					{#if node.lines !== undefined}
						<p class="count">{node.lines} lines</p>
					{/if}
					{#if importsOf[node.id]}
						<ul class="imports">
							{#each importsOf[node.id] as file (file)}
								<li>imports {file}</li>
							{/each}
						</ul>
					{/if}
				</div>
			{/each}
		</div>
		{#if kinds.size > 1 && !compact}
			<ul class="legend">
				{#if kinds.has('code')}
					<li><span class="swatch code"></span>Code</li>
				{/if}
				{#if kinds.has('test') || kinds.has('mock')}
					<li><span class="swatch test"></span>Tests and mocks</li>
				{/if}
			</ul>
		{/if}
		{#if caption}
			<p class="caption">{caption}</p>
		{/if}
		{#if showBoundary}
			<div class="boundary">
				{#if importsFromApp !== undefined}
					<p class="inbound">
						<span aria-hidden="true"></span>
						Imports {importsFromApp} files from the rest of the app
					</p>
				{/if}
				{#if importsBack !== undefined}
					<p class="outbound">
						<span aria-hidden="true"></span>
						{importsBack} imports back
					</p>
				{/if}
			</div>
		{/if}
	</div>
	<ul class="sr-only">
		{#each edges as edge (`${edge.from}-${edge.to}`)}
			<li>{byId[edge.from]?.file} imports {byId[edge.to]?.file}</li>
		{/each}
	</ul>
</figure>

<style>
	.frame {
		border: 1px dashed #3f3f46;
		border-radius: 0.75rem;
		background: rgb(9 9 11 / 0.72);
		padding: 1rem;
	}

	.kicker {
		margin: 0 0 0.85rem;
		color: #a1a1aa;
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	.board {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.edges {
		display: none;
	}

	.node {
		position: relative;
		min-width: 0;
		border: 1px solid transparent;
		border-radius: 0.65rem;
		padding: 0.7rem 0.8rem 0.75rem;
	}

	.node.code {
		border-color: #60a5fa;
		background: rgb(23 37 84 / 0.35);
	}

	.node.test,
	.node.mock {
		border-color: #fbbf24;
		background: rgb(69 26 3 / 0.35);
	}

	.kind {
		margin: 0;
		color: #a1a1aa;
		font-size: 0.65rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.node.code .kind {
		color: #93c5fd;
	}

	.node.test .kind,
	.node.mock .kind {
		color: #fcd34d;
	}

	.folder {
		margin: 0.35rem 0 0;
		color: #71717a;
		font-size: 0.75rem;
		line-height: 1.2;
	}

	.file {
		margin: 0.15rem 0 0;
		color: #f4f4f5;
		font-size: 0.92rem;
		line-height: 1.3;
		overflow-wrap: break-word;
	}

	.count {
		margin: 0.3rem 0 0;
		color: #a1a1aa;
		font-size: 0.75rem;
		line-height: 1.2;
	}

	.imports {
		margin: 0.55rem 0 0;
		padding: 0;
		list-style: none;
		color: #d4d4d8;
		font-size: 0.78rem;
		line-height: 1.45;
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.85rem 1.25rem;
		margin: 0.9rem 0 0;
		padding: 0;
		list-style: none;
		color: #a1a1aa;
		font-size: 0.75rem;
	}

	.legend li {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	.swatch {
		width: 0.7rem;
		height: 0.7rem;
		border: 1px solid transparent;
		border-radius: 0.2rem;
	}

	.swatch.code {
		border-color: #60a5fa;
		background: rgb(23 37 84 / 0.8);
	}

	.swatch.test {
		border-color: #fbbf24;
		background: rgb(69 26 3 / 0.8);
	}

	.caption {
		margin: 0.9rem 0 0;
		color: #e4e4e7;
		font-size: 0.92rem;
	}

	.boundary {
		display: grid;
		gap: 0.45rem;
		margin-top: 0.9rem;
		border-top: 1px dashed #3f3f46;
		padding-top: 0.85rem;
	}

	.boundary p {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		margin: 0;
		font-size: 0.86rem;
		line-height: 1.4;
	}

	.inbound {
		color: #d4d4d8;
	}

	.inbound span {
		width: 1.75rem;
		flex: none;
		border-top: 1px solid #a1a1aa;
	}

	.outbound {
		color: #fca5a5;
	}

	.outbound span {
		width: 1.75rem;
		flex: none;
		border-top: 1px dashed #f87171;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: -1px;
		padding: 0;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	@media (min-width: 768px) {
		.graph:not(.compact) {
			width: min(48rem, calc(100vw - 3rem));
			margin-left: 50%;
			transform: translateX(-50%);
		}
	}

	@media (min-width: 640px) {
		.board {
			display: grid;
			grid-template-columns: var(--template);
			grid-template-rows: repeat(var(--rows), 8.25rem);
			align-items: stretch;
			column-gap: 0;
			row-gap: 0;
		}

		.compact .board {
			grid-template-rows: auto;
		}

		.edges {
			position: relative;
			z-index: 0;
			display: block;
			width: 100%;
			height: 100%;
		}

		.edges path {
			fill: none;
			stroke: #a1a1aa;
			stroke-width: 1.5;
			vector-effect: non-scaling-stroke;
		}

		.node {
			z-index: 1;
			height: calc(100% - 0.75rem);
			margin: 0.375rem 0.2rem;
		}

		.compact .node {
			height: auto;
		}

		.node.target::before {
			content: '';
			position: absolute;
			top: 50%;
			left: 0;
			width: 0;
			height: 0;
			translate: -100% -50%;
			border-top: 5px solid transparent;
			border-bottom: 5px solid transparent;
			border-left: 6px solid #a1a1aa;
		}

		.imports {
			display: none;
		}
	}
</style>
