<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children, label = 'Note' }: { children?: Snippet; label?: string } = $props();
</script>

<aside class="not-prose my-8 border-l-2 border-brand-lime bg-zinc-950/75 px-4 py-4 sm:px-5">
	<p class="text-xs font-medium uppercase tracking-[0.14em] text-brand-lime">{label}</p>
	<div class="callout-body mt-2 text-base leading-relaxed text-zinc-100">
		{@render children?.()}
	</div>
</aside>

<style>
	.callout-body :global(p) {
		margin: 0;
	}
</style>
