<script lang="ts">
	import type { Snippet } from 'svelte';

	let { href, children } = $props<{ href: string; children: Snippet }>();
</script>

<a class="text-brand-lime transition-colors duration-200 hover:text-brand-lime/80" {href}>
	{@render children()} →
</a>
