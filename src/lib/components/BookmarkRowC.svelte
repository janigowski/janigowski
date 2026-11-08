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

<article class="flex items-start gap-3 sm:gap-4">
	<a
		href={sourceHref}
		target="_blank"
		rel="noreferrer"
		class="group flex min-w-0 flex-1 items-start gap-4 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:gap-6"
	>
		<BookmarkThumbnail src={bookmark.image} alt="" frame="w-[7.5rem] sm:w-[180px]" cover />
		<div class="min-w-0 flex-1">
			<p class="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px] leading-4 font-medium tracking-wider text-zinc-200">
				<span class="uppercase">{bookmark.bookmarkType}</span>
				<span aria-hidden="true">·</span>
				<BookmarkFavicon url={bookmark.url} size={14} />
				<span class="font-normal tracking-normal break-all">{domain}</span>
			</p>
			<h2
				class="mt-1.5 text-xl leading-tight font-semibold text-white group-hover:underline group-hover:decoration-white/50 group-hover:underline-offset-4 sm:text-2xl"
			>
				{bookmark.title}
			</h2>
			{#if bookmark.author || saved}
				<p class="mt-1.5 flex flex-wrap items-center gap-x-1.5 text-sm leading-5 text-zinc-200">
					{#if bookmark.author}<span>{bookmark.author}</span>{/if}
					{#if bookmark.author && saved}<span aria-hidden="true">·</span>{/if}
					{#if saved}<time datetime={saved.iso}>{saved.label}</time>{/if}
				</p>
			{/if}
			{#if bookmark.description}
				<p class="mt-2 line-clamp-2 max-w-[60ch] text-sm leading-6 text-zinc-300">{bookmark.description}</p>
			{/if}
			{#if bookmark.tags.length > 0}
				<ul class="mt-3 flex flex-wrap gap-1.5">
					{#each bookmark.tags as tag (tag)}
						<li class="rounded-full border border-white/20 px-2 py-0.5 text-xs text-zinc-200">{tag}</li>
					{/each}
				</ul>
			{/if}
			<span class="sr-only"> (opens in a new tab)</span>
		</div>
	</a>
	{#if note}
		<a
			href="/bookmarks/{bookmark.slug}"
			class="shrink-0 rounded-md px-2 py-1 text-sm font-medium text-zinc-100 underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
		>
			Note
		</a>
	{/if}
</article>
