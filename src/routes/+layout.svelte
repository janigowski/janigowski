<script lang="ts">
	import './layout.css';
	import Analytics from '$components/Analytics.svelte';
	import ScrollToTop from '$components/ScrollToTop.svelte';
	let { children } = $props();
</script>
<svelte:head><title>janigowski.dev</title><meta name="description" content="Product Engineer. Software Architect. Frontend. Creative." /><meta property="og:title" content="janigowski.dev" /><meta property="og:image" content="https://janigowski.dev/og.png" /><meta name="twitter:card" content="summary_large_image" /><link rel="icon" href="/favicon.png" type="image/png" /><link rel="icon" href="/favicon.svg" type="image/svg+xml" /></svelte:head>
<div class="fixed inset-0 -z-20 print:hidden"><img src="/janigowski-large-wallpaper.jpg" alt="Background" class="h-full w-full object-cover" fetchpriority="high" loading="eager" decoding="async" /><div class="absolute inset-0 bg-black/30"></div></div><div class="pointer-events-none fixed inset-0 z-100 opacity-[0.18] print:hidden" style="background-image: url('/film-grain.svg'); background-repeat: repeat;"></div><div class="relative flex min-h-screen flex-col"><main class="flex-1">{@render children()}</main><ScrollToTop /><Analytics /></div>
