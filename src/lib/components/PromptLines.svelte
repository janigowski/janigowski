<script lang="ts">
	let { prompts }: { prompts: string[] } = $props();
</script>

<div class="not-prose my-6 overflow-hidden rounded-xl border border-zinc-700 bg-zinc-950">
	<ol class="px-4 py-3 font-mono text-[0.84rem] leading-relaxed sm:text-sm">
		{#each prompts as prompt, index (index)}
			<li class="flex gap-3 py-1.5">
				<span class="shrink-0 text-brand-lime select-none" aria-hidden="true">&gt;</span>
				<span class="text-zinc-200">{prompt}</span>
			</li>
		{/each}
	</ol>
</div>
