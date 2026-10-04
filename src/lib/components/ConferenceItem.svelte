<script lang="ts">
	import type { Snippet } from 'svelte';

	let { date, place, conference, children } = $props<{
		date: string;
		place: string;
		conference: string;
		children: Snippet;
	}>();
</script>

<div class="group relative py-12 first:pt-0 sm:hidden">
	<time class="text-sm text-zinc-500 transition group-hover:text-zinc-300">{date}</time>
	<h3 class="mt-3 text-xl font-medium text-zinc-200 transition group-hover:text-white">
		{@render children()}
	</h3>
	<div class="mt-2 flex flex-col gap-1 text-sm">
		<span class="text-zinc-400 transition group-hover:text-zinc-300">{place}</span>
		<span class="text-zinc-400 transition group-hover:text-zinc-300">{conference}</span>
	</div>
</div>

<div
	class="group relative hidden py-12 first:pt-0 sm:grid sm:grid-cols-[100px_1fr] sm:gap-8"
>
	<time class="text-sm text-zinc-500 transition group-hover:text-zinc-300">{date}</time>
	<div>
		<div class="flex items-center gap-4 text-sm">
			<span class="text-zinc-400 transition group-hover:text-zinc-300">{place}</span>
			<span class="h-px w-12 bg-zinc-700 transition group-hover:bg-zinc-600"></span>
			<span class="text-zinc-400 transition group-hover:text-zinc-300">{conference}</span>
		</div>
		<h3 class="mt-3 text-xl font-medium text-zinc-200 transition group-hover:text-white">
			{@render children()}
		</h3>
	</div>
</div>
