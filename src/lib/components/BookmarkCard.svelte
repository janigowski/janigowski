<script lang="ts">
	import BookmarkFavicon from '$components/BookmarkFavicon.svelte';
	import BookmarkThumbnail from '$components/BookmarkThumbnail.svelte';
	import { bookmarkDestinationLabel, bookmarkSourceHref, formatCalendarDate, hasNote } from '$content/bookmarks';
	import type { Bookmark } from '$content/types';

	let { bookmark }: { bookmark: Bookmark } = $props();
	let saved = $derived(formatCalendarDate(bookmark.date));
	let note = $derived(hasNote(bookmark.body));
	let sourceHref = $derived(bookmarkSourceHref(bookmark.url));
	let destination = $derived(bookmarkDestinationLabel(bookmark.url));
</script>

<article class="article-enter group relative flex flex-col gap-6 py-10 first:pt-0 last:pb-0 sm:flex-row sm:gap-8">
	<BookmarkThumbnail src={bookmark.image} alt={bookmark.title} />
	<div class="min-w-0 flex-auto">
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
				href={sourceHref}
				target="_blank"
				rel="noreferrer"
				class="flex min-w-0 items-center gap-3 transition-colors duration-300 hover:text-zinc-200"
			>
				<BookmarkFavicon url={bookmark.url} />
				<span class="min-w-0">
					{bookmark.title}
					<span aria-hidden="true">↗</span>
				</span>
			</a>
		</h2>
		<a
			href={sourceHref}
			target="_blank"
			rel="noreferrer"
			class="mt-2 block max-w-full text-sm break-all text-zinc-500 transition-colors duration-300 hover:text-zinc-300"
		>
			{destination}
		</a>
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
