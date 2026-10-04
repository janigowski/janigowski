<script lang="ts">
	import Nav from '$components/Nav.svelte';
	let { children } = $props();
</script>

<div class="relative min-h-screen">
	<div class="relative pb-16">
		<Nav />
		<div class="container mx-auto space-y-8 px-6 pt-40 md:space-y-16 lg:px-8">
			{@render children()}
		</div>
	</div>
</div>
