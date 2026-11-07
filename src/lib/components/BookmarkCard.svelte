<script lang="ts">
	import { formatCalendarDate, hasNote } from '$content/bookmarks';
	import type { Bookmark } from '$content/types';

	let { bookmark }: { bookmark: Bookmark } = $props();
	let saved = $derived(formatCalendarDate(bookmark.date));
	let note = $derived(hasNote(bookmark.body));
</script>

<article class="article-enter group relative py-10 first:pt-0 last:pb-0">
	<div class="flex flex-wrap items-center gap-4 text-xs">
		<a
			href="/bookmarks?type={bookmark.bookmarkType}"
			class="rounded-md bg-brand-purple-darker/10 px-2 py-1 text-xs font-medium text-brand-olive transition-colors duration-300 hover:bg-brand-purple-darker/20"
		>
			{bookmark.bookmarkType}
		</a>
		{#if note}
			<a
				href="/bookmarks/{bookmark.slug}"
				class="group/link ml-auto inline-flex items-center gap-2 text-xs font-medium text-brand-lime transition-colors duration-300 hover:text-brand-lime/80"
			>
				Read note
				<span class="transition-transform duration-300 group-hover/link:translate-x-1">→</span>
			</a>
		{/if}
	</div>
	<h2 class="mt-4 text-xl leading-tight font-medium text-white">
		<a
			href={bookmark.url}
			target="_blank"
			rel="noreferrer"
			class="transition-colors duration-300 hover:text-zinc-200"
		>
			{bookmark.title}
			<span aria-hidden="true">↗</span>
		</a>
	</h2>
	{#if bookmark.author}
		<p class="mt-2 text-base text-brand-olive">{bookmark.author}</p>
	{/if}
	{#if bookmark.description}
		<p class="mt-3 text-sm leading-6 text-zinc-400">{bookmark.description}</p>
	{/if}
	<div class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
		{#if saved}
			<time class="text-sm text-brand-olive/80" datetime={saved.iso}>{saved.label}</time>
		{/if}
		{#each bookmark.tags as tag (tag)}
			<a
				href="/bookmarks?tag={encodeURIComponent(tag)}"
				class="text-sm text-brand-olive/80 transition-colors duration-300 hover:text-brand-olive"
			>
				{tag}
			</a>
		{/each}
	</div>
</article>

<style>
	.article-enter {
		animation: fade-up 0.4s ease-out both;
	}

	@keyframes fade-up {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.article-enter {
			animation: none;
		}
	}
</style>
