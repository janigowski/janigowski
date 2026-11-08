<script lang="ts">
	import { ImageOff } from 'lucide-svelte';
	import { showBookmarkImage } from '$content/bookmarks';

	let {
		src,
		alt,
		frame = 'w-full max-w-xs sm:w-64',
		cover = false
	}: {
		src?: string;
		alt: string;
		frame?: string;
		cover?: boolean;
	} = $props();
	let failedSrc = $state<string | undefined>(undefined);
	let visible = $derived(showBookmarkImage(src, failedSrc));
</script>

<div
	class="relative aspect-video shrink-0 overflow-hidden rounded-lg border border-white/10 bg-zinc-950/50 {frame}"
>
	{#if src && visible}
		<img
			{src}
			{alt}
			width="640"
			height="360"
			loading="lazy"
			decoding="async"
			class="absolute inset-0 h-full w-full {cover ? 'object-cover' : 'object-contain'}"
			onerror={() => (failedSrc = src)}
		/>
	{:else}
		<div class="absolute inset-0 flex items-center justify-center text-brand-olive/80" aria-hidden="true">
			<ImageOff class="h-6 w-6" />
		</div>
	{/if}
</div>
