<script lang="ts">
	import type { Book, Post, Project } from '$content/types';
	let { item } = $props<{ item: Book | Post | Project }>();
	let href = $derived(
		item.kind === 'book'
			? `/library/${item.slug}`
			: `/${item.kind === 'post' ? 'posts' : 'projects'}/${item.slug}`
	);
	let date = $derived(
		item.date
			? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(item.date))
			: undefined
	);
</script>

<a {href}>
	<article class="p-4 md:p-8">
		<div class="flex items-center justify-between gap-2">
			<span
				class="text-xs text-zinc-200 drop-shadow-orange duration-1000 group-hover:border-zinc-200 group-hover:text-white"
			>
				{#if date}
					<time datetime={item.date}>{date}</time>
				{:else}
					<span>SOON</span>
				{/if}
			</span>
		</div>
		<h2
			class="z-20 font-display text-xl font-medium text-zinc-200 duration-1000 group-hover:text-white lg:text-3xl"
		>
			{item.title}
		</h2>
		<p class="z-20 mt-4 text-sm text-zinc-400 duration-1000 group-hover:text-zinc-200">
			{item.kind === 'book' ? item.author : item.description}
		</p>
	</article>
</a>
