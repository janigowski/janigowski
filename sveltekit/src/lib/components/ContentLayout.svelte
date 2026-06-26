<script lang="ts">
	import Nav from './Nav.svelte';
	let { children } = $props();
</script>
<div class="relative min-h-screen"><Nav /><div class="container mx-auto space-y-12 px-6 pb-16 pt-40 lg:px-8">{@render children()}</div></div>
