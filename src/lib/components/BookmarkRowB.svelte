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
		class="group flex min-w-0 flex-1 items-start gap-3 rounded-md py-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
	>
		<BookmarkThumbnail src={bookmark.image} alt="" frame="w-[120px]" cover />
		<div class="min-w-0 flex-1">
			<div class="flow-root">
				{#if saved}
					<time class="float-right ml-3 text-sm leading-snug whitespace-nowrap text-zinc-200" datetime={saved.iso}>
						{saved.label}
					</time>
				{/if}
				<h2
					class="text-base leading-snug font-semibold text-white group-hover:underline group-hover:decoration-white/50 group-hover:underline-offset-4"
				>
					{bookmark.title}
				</h2>
			</div>
			<p class="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm leading-5 text-zinc-200">
				<BookmarkFavicon url={bookmark.url} size={16} />
				<span class="break-all">{domain}</span>
				{#if bookmark.author}
					<span aria-hidden="true">·</span>
					<span>{bookmark.author}</span>
				{/if}
				{#each bookmark.tags as tag (tag)}
					<span aria-hidden="true">·</span>
					<span>{tag}</span>
				{/each}
			</p>
			<span class="sr-only"> (opens in a new tab)</span>
		</div>
	</a>
	{#if note}
		<a
			href="/bookmarks/{bookmark.slug}"
			class="mt-3 shrink-0 rounded-md px-2 py-1 text-sm font-medium text-zinc-100 underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
		>
			Note
		</a>
	{/if}
</article>
