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

<article class="flex items-start gap-2 sm:gap-3">
	<a
		href={sourceHref}
		target="_blank"
		rel="noreferrer"
		class="group flex min-w-0 flex-1 items-start gap-3 rounded-md py-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:gap-4"
	>
		<div class="relative shrink-0">
			<BookmarkThumbnail src={bookmark.image} alt="" frame="w-28 sm:w-60" cover />
			<span
				class="pointer-events-none absolute bottom-1.5 left-1.5 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-white uppercase"
			>
				{bookmark.bookmarkType}
			</span>
		</div>
		<div class="min-w-0 flex-1">
			<h2
				class="line-clamp-3 text-base leading-snug font-semibold text-white group-hover:underline group-hover:decoration-white/50 group-hover:underline-offset-4 sm:line-clamp-2 sm:text-lg"
			>
				{bookmark.title}
			</h2>
			<p class="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm leading-5 text-zinc-200">
				{#if bookmark.author}
					<span>{bookmark.author}</span>
					<span aria-hidden="true">·</span>
				{/if}
				<BookmarkFavicon url={bookmark.url} size={16} />
				<span class="break-all">{domain}</span>
				{#if saved}
					<span aria-hidden="true">·</span>
					<time datetime={saved.iso}>{saved.label}</time>
				{/if}
			</p>
			{#if bookmark.description}
				<p class="bookmark-description mt-2 text-sm leading-6 text-zinc-300">{bookmark.description}</p>
			{/if}
			{#if bookmark.tags.length > 0}
				<p class="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-zinc-200">
					{#each bookmark.tags as tag (tag)}
						<span>{tag}</span>
					{/each}
				</p>
			{/if}
			<span class="sr-only"> (opens in a new tab)</span>
		</div>
	</a>
	{#if note}
		<a
			href="/bookmarks/{bookmark.slug}"
			class="mt-4 shrink-0 rounded-md px-2 py-1 text-sm font-medium text-zinc-100 underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
		>
			Note
		</a>
	{/if}
</article>

<style>
	.bookmark-description {
		display: none;
	}

	@media (min-width: 40rem) {
		.bookmark-description {
			display: -webkit-box;
			overflow: hidden;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			line-clamp: 2;
		}
	}
</style>
