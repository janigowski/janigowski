<script lang="ts">
	let { url, size = 32 }: { url: string; size?: number } = $props();
	let failed = $state(false);

	function faviconSrc(pageUrl: string) {
		try {
			const domain = new URL(pageUrl).hostname;
			return domain ? `https://favicone.com/${domain}?s=64` : undefined;
		} catch {
			return undefined;
		}
	}

	let src = $derived(faviconSrc(url));
</script>

{#if src && !failed}
	<img
		{src}
		alt=""
		width={size}
		height={size}
		loading="lazy"
		decoding="async"
		class="shrink-0 object-contain"
		style:width="{size}px"
		style:height="{size}px"
		onerror={() => (failed = true)}
	/>
{/if}
