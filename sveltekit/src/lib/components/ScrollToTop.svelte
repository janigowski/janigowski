<script lang="ts">
	import { onMount } from 'svelte';

	let isVisible = $state(false);

	onMount(() => {
		const toggleVisibility = () => {
			isVisible = window.scrollY > 300;
		};

		toggleVisibility();
		window.addEventListener('scroll', toggleVisibility, { passive: true });

		return () => window.removeEventListener('scroll', toggleVisibility);
	});

	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

<button
	type="button"
	onclick={scrollToTop}
	class="fixed right-8 bottom-8 z-50 rounded-full bg-white/10 p-3 text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white/20 print:hidden {isVisible
		? 'opacity-100'
		: 'pointer-events-none opacity-0'}"
	aria-label="Scroll to top"
	aria-hidden={!isVisible}
	tabindex={isVisible ? 0 : -1}
>
	<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
	</svg>
</button>
