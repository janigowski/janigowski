<script lang="ts">
	import BookmarkFavicon from '$components/BookmarkFavicon.svelte';
	import BookmarkThumbnail from '$components/BookmarkThumbnail.svelte';
	import { bookmarkDomain, bookmarkSourceHref, formatCalendarDate, hasNote } from '$content/bookmarks';
	import type { Bookmark } from '$content/types';

	let { bookmark }: { bookmark: Bookmark } = $props();
	let saved = $derived(formatCalendarDate(bookmark.date));
	let note = $derived(hasNote(bookmark.body));
	let sourceHref = $derived(bookmarkSourceHref(bookmark.url));
	let domain = $derived(bookmarkDomain(bookmark.url));
</script>

<article class="bookmark-row flex items-start gap-3 py-3">
	<a
		href={sourceHref}
		target="_blank"
		rel="noreferrer"
		class="flex min-w-0 flex-1 items-start gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:gap-3"
	>
		<BookmarkThumbnail src={bookmark.image} alt="" />
		<div class="min-w-0 flex-1">
			<div class="flow-root">
				{#if bookmark.author || saved}
					<p class="float-right mb-1 flex w-full items-baseline justify-end gap-x-1.5 text-right text-xs leading-snug whitespace-nowrap text-zinc-200 sm:mb-0 sm:ml-3 sm:w-auto sm:text-sm">
						{#if bookmark.author}<span>{bookmark.author}</span>{/if}
						{#if bookmark.author && saved}<span aria-hidden="true">•</span>{/if}
						{#if saved}<time datetime={saved.iso}>{saved.label}</time>{/if}
					</p>
				{/if}
				<h2 class="text-base leading-snug font-semibold text-white">{bookmark.title}</h2>
			</div>
			<p class="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm leading-5 text-zinc-200">
				<BookmarkFavicon url={bookmark.url} size={16} />
				<span class="break-all">{domain}</span>
				{#each bookmark.tags as tag (tag)}
					<span>{tag}</span>
				{/each}
			</p>
			<span class="sr-only"> (opens in a new tab)</span>
		</div>
	</a>
	{#if note}
		<a
			href="/bookmarks/{bookmark.slug}"
			class="shrink-0 self-start rounded-md px-2 py-1 text-sm font-medium text-zinc-100 underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
		>
			Note
		</a>
	{/if}
</article>

<style>
	.bookmark-row {
		opacity: 0.7;
		transition: opacity 150ms ease-out;
	}

	.bookmark-row:hover,
	.bookmark-row:has(:focus-visible) {
		opacity: 1;
	}
</style>
