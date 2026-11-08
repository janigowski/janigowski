<script lang="ts">
	let { url }: { url: string } = $props();
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
		width="32"
		height="32"
		loading="lazy"
		decoding="async"
		class="size-8 shrink-0 object-contain"
		onerror={() => (failed = true)}
	/>
{/if}
