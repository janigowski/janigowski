<script lang="ts">
	import { faviconDisplay } from '$content/favicon';

	let { src }: { src?: string } = $props();
	let failedSrc = $state<string | undefined>(undefined);
	let display = $derived(faviconDisplay(src, failedSrc));
</script>

{#if display}
	<img
		src={display.src}
		alt=""
		width={display.width}
		height={display.height}
		style="width: {display.width}px; height: {display.height}px; max-width: {display.max}px; max-height: {display.max}px;"
		loading="lazy"
		decoding="async"
		class="shrink-0 object-contain"
		onerror={() => (failedSrc = src)}
	/>
{/if}
