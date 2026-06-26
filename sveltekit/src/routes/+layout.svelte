<script lang="ts">
	import './layout.css';
	import Analytics from '$components/Analytics.svelte';
	import Particles from '$components/Particles.svelte';
	let { children } = $props();
</script>
<svelte:head><title>janigowski.dev</title><meta name="description" content="Product Engineer. Software Architect. Frontend. Creative." /><meta property="og:title" content="janigowski.dev" /><meta property="og:image" content="https://janigowski.dev/og.png" /><meta name="twitter:card" content="summary_large_image" /><link rel="icon" href="/favicon.png" /></svelte:head>
<div class="fixed inset-0 -z-20 print:hidden"><img src="/janigowski-large-wallpaper.jpg" alt="" class="h-full w-full object-cover" /><div class="absolute inset-0 bg-black/40"></div></div><div class="pointer-events-none fixed inset-0 z-[100] opacity-[0.18] print:hidden" style="background-image: url('/film-grain.svg'); background-repeat: repeat;"></div><Particles /><main class="relative min-h-screen">{@render children()}</main><Analytics />
