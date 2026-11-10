<script lang="ts">
	type Stat = {
		value: string;
		label: string;
	};

	type Detail = {
		files: string;
		lines: string;
		label: string;
	};

	let { stats, note, details }: { stats: Stat[]; note?: string; details?: Detail[] } = $props();
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
		{#if details}
			<div class="grid grid-cols-1 border-t border-zinc-800 sm:grid-cols-2">
				{#each details as detail, index (detail.label)}
					<div
						class={[
							'px-4 py-4 text-center',
							index > 0 && 'border-t border-zinc-800 sm:border-t-0 sm:border-l'
						]}
					>
						<p class="text-sm leading-snug text-zinc-200">
							<span class="font-display text-2xl text-zinc-100">{detail.files}</span>
							<span class="text-zinc-500"> files</span>
							<span class="mx-1.5 text-zinc-600" aria-hidden="true">|</span>
							<span class="font-display text-2xl text-zinc-100">{detail.lines}</span>
							<span class="text-zinc-500"> lines</span>
						</p>
						<p class="mt-1 text-xs text-zinc-400">{detail.label}</p>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</section>
