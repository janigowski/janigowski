<script lang="ts">
	let {
		types,
		tags,
		typeCounts,
		tagCounts,
		total,
		selectedType,
		selectedTag
	}: {
		types: string[];
		tags: string[];
		typeCounts: Record<string, number>;
		tagCounts: Record<string, number>;
		total: number;
		selectedType?: string;
		selectedTag?: string;
	} = $props();

	const hrefFor = (type?: string, tag?: string) => {
		const params = new URLSearchParams();
		if (type) params.set('type', type);
		if (tag) params.set('tag', tag);
		const query = params.toString();
		return query ? `?${query}` : '/library';
	};

	const chipClass = (active: boolean) =>
		`group text-sm px-4 py-2 rounded-xl transition-all duration-300 ${
			active
				? 'bg-zinc-800/80 text-zinc-100 shadow-lg shadow-zinc-900/20'
				: 'bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-300'
		}`;

	const countClass = (active: boolean) =>
		`px-2 py-0.5 rounded-md text-xs transition-colors duration-300 ${
			active ? 'bg-zinc-700/80 text-zinc-300' : 'bg-zinc-800/80 text-zinc-500 group-hover:text-zinc-400'
		}`;
</script>

<div class="flex flex-col gap-8">
	<div class="space-y-3">
		<h3 class="text-sm font-medium text-zinc-300">Type</h3>
		<div class="flex flex-wrap gap-2">
			<a
				href={hrefFor(undefined, selectedTag)}
				data-sveltekit-noscroll
				data-sveltekit-keepfocus
				class={chipClass(!selectedType)}
			>
				<span class="flex items-center gap-2">
					All
					<span class={countClass(!selectedType)}>{total}</span>
				</span>
			</a>
			{#each types as type}
				<a
					href={hrefFor(type, selectedTag)}
					data-sveltekit-noscroll
					data-sveltekit-keepfocus
					class={chipClass(selectedType === type)}
				>
					<span class="flex items-center gap-2">
						{type}
						<span class={countClass(selectedType === type)}>{typeCounts[type]}</span>
					</span>
				</a>
			{/each}
		</div>
	</div>
	<div class="space-y-3">
		<h3 class="text-sm font-medium text-zinc-300">Tag</h3>
		<div class="flex flex-wrap gap-2">
			<a
				href={hrefFor(selectedType, undefined)}
				data-sveltekit-noscroll
				data-sveltekit-keepfocus
				class={chipClass(!selectedTag)}
			>
				<span class="flex items-center gap-2">
					All
					<span class={countClass(!selectedTag)}>{total}</span>
				</span>
			</a>
			{#each tags as tag}
				<a
					href={hrefFor(selectedType, tag)}
					data-sveltekit-noscroll
					data-sveltekit-keepfocus
					class={chipClass(selectedTag === tag)}
				>
					<span class="flex items-center gap-2">
						{tag}
						<span class={countClass(selectedTag === tag)}>{tagCounts[tag]}</span>
					</span>
				</a>
			{/each}
		</div>
	</div>
</div>
