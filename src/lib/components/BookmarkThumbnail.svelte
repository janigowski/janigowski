<script lang="ts">
	import { ImageOff } from 'lucide-svelte';
	import { showBookmarkImage } from '$content/bookmarks';

	let { src, alt }: { src?: string; alt: string } = $props();
	let failedSrc = $state<string | undefined>(undefined);
	let visible = $derived(showBookmarkImage(src, failedSrc));
</script>

<div class="relative aspect-video w-40 shrink-0 overflow-hidden rounded-md border border-white/10 bg-zinc-950/50 sm:w-48">
	{#if src && visible}
		<img
			{src}
			{alt}
			width="384"
			height="216"
			loading="lazy"
			decoding="async"
			class="absolute inset-0 h-full w-full object-cover"
			onerror={() => (failedSrc = src)}
		/>
	{:else}
		<div class="absolute inset-0 flex items-center justify-center text-zinc-300" aria-hidden="true">
			<ImageOff class="h-4 w-4" />
		</div>
	{/if}
</div>
