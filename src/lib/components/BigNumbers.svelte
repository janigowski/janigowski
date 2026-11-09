<script lang="ts">
	type Stat = {
		value: string;
		label: string;
	};

	let { stats, note }: { stats: Stat[]; note?: string } = $props();
</script>

<section class="not-prose my-8" aria-label={note ?? 'Results'}>
	<div class="overflow-hidden rounded-xl border border-zinc-700 bg-zinc-950/80">
		<div class="flex items-stretch">
			{#each stats as stat, index (stat.label)}
				{#if index > 0}
					<div class="w-px self-stretch bg-zinc-700" aria-hidden="true"></div>
				{/if}
				<div class="flex min-w-0 flex-1 flex-col items-center px-3 py-8 text-center sm:px-6">
					<p class="font-display text-4xl leading-none text-brand-lime sm:text-6xl">{stat.value}</p>
					<p class="mt-3 text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">{stat.label}</p>
				</div>
			{/each}
		</div>
		{#if note}
			<p class="border-t border-zinc-800 px-4 py-3 text-center text-sm text-zinc-400">{note}</p>
		{/if}
	</div>
</section>
