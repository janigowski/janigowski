<script lang="ts">
	let { text } = $props<{ text: string }>();
</script>

<h1
	class="title-enter bg-gradient-to-b from-white to-zinc-400 bg-clip-text font-display text-4xl font-bold tracking-tight text-transparent sm:text-7xl sm:leading-[1.5]"
>
	{text}
</h1>

<style>
	.title-enter {
		animation: fade-up 0.4s ease-in-out both;
	}

	@keyframes fade-up {
		from {
			opacity: 0;
			transform: translateY(5px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.title-enter {
			animation: none;
		}
	}
</style>
