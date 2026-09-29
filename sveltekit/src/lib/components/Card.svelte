<script lang="ts">
	let { children } = $props();
	let mouseX = $state(0);
	let mouseY = $state(0);

	function trackPointer(event: PointerEvent) {
		const bounds = (event.currentTarget as HTMLDivElement).getBoundingClientRect();
		mouseX = event.clientX - bounds.left;
		mouseY = event.clientY - bounds.top;
	}
</script>

<div
	role="group"
	onpointermove={trackPointer}
	style:--mouse-x={`${mouseX}px`}
	style:--mouse-y={`${mouseY}px`}
	class="group relative h-full w-full overflow-hidden rounded-xl border border-zinc-600 duration-700 hover:border-zinc-400/50 hover:bg-zinc-800/10 md:gap-8"
>
	<div class="pointer-events-none">
		<div
			class="absolute inset-0 z-0 mask-[linear-gradient(black,transparent)] transition duration-1000"
		></div>
		<div
			class="pointer-glow absolute inset-0 z-10 bg-linear-to-br via-zinc-100/10 opacity-100 transition duration-1000 group-hover:opacity-50"
		></div>
		<div
			class="pointer-glow absolute inset-0 z-10 opacity-0 mix-blend-overlay transition duration-1000 group-hover:opacity-100"
		></div>
	</div>
	{@render children()}
</div>

<style>
	.pointer-glow {
		-webkit-mask-image: radial-gradient(
			240px at var(--mouse-x) var(--mouse-y),
			white,
			transparent
		);
		mask-image: radial-gradient(240px at var(--mouse-x) var(--mouse-y), white, transparent);
	}
</style>
