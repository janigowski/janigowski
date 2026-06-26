<script lang="ts">
	import { onMount } from 'svelte';
	onMount(() => {
		if (location.hostname === 'localhost') return;
		const cloudflare = document.createElement('script');
		cloudflare.defer = true;
		cloudflare.src = 'https://static.cloudflareinsights.com/beacon.min.js';
		cloudflare.setAttribute('data-cf-beacon', '{"token":"68f1b866eea44cf5b3c46864fcdcc591"}');
		document.body.appendChild(cloudflare);
		const vercel = document.createElement('script');
		vercel.defer = true;
		vercel.src = '/_vercel/insights/script.js';
		document.body.appendChild(vercel);
	});
</script>
