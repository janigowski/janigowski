<script lang="ts">
	import BookmarkFavicon from '$components/BookmarkFavicon.svelte';
	import BookmarkThumbnail from '$components/BookmarkThumbnail.svelte';
	import { bookmarkDomain, bookmarkSourceHref, formatCalendarDate } from '$content/bookmarks';
	import type { Bookmark } from '$content/types';

	let { bookmark }: { bookmark: Bookmark } = $props();
	let saved = $derived(formatCalendarDate(bookmark.date));
	let sourceHref = $derived(bookmarkSourceHref(bookmark.url));
	let domain = $derived(bookmarkDomain(bookmark.url));

	const linkClass =
		'cursor-pointer rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';
	const titleLinkClass = `${linkClass} text-inherit`;
	const domainLinkClass = `${linkClass} break-all text-inherit underline-offset-4 hover:underline focus-visible:underline`;
</script>

<article class="article-enter pb-4">
	<div class="bookmark-row flex flex-col gap-5">
		<h2 class="text-xl leading-tight font-medium text-white sm:hidden">
			<a href={sourceHref} target="_blank" rel="noreferrer" class={titleLinkClass}>
				{bookmark.title}
				<span aria-hidden="true">↗</span>
				<span class="sr-only"> (opens in a new tab)</span>
			</a>
		</h2>
		<div class="flex items-start gap-4 sm:gap-6">
			<a href={sourceHref} target="_blank" rel="noreferrer" class="{linkClass} shrink-0">
				<BookmarkThumbnail src={bookmark.image} alt={bookmark.title} />
				<span class="sr-only"> (opens in a new tab)</span>
			</a>
			<div class="flex min-w-0 flex-1 flex-col gap-3 sm:gap-4">
				<div class="hidden items-start justify-between gap-8 sm:flex">
					<h2 class="min-w-0 flex-1 text-xl leading-tight font-medium text-white">
						<a href={sourceHref} target="_blank" rel="noreferrer" class={titleLinkClass}>
							{bookmark.title}
							<span aria-hidden="true">↗</span>
							<span class="sr-only"> (opens in a new tab)</span>
						</a>
					</h2>
					{#if bookmark.author || saved}
						<p class="flex shrink-0 items-baseline gap-x-1.5 pt-0.5 text-sm leading-6 whitespace-nowrap text-zinc-200">
							{#if bookmark.author}<span>{bookmark.author}</span>{/if}
							{#if bookmark.author && saved}<span aria-hidden="true">•</span>{/if}
							{#if saved}<time datetime={saved.iso}>{saved.label}</time>{/if}
						</p>
					{/if}
				</div>
				{#if bookmark.author}
					<p class="text-sm leading-6 text-zinc-200 sm:hidden">{bookmark.author}</p>
				{/if}
				<p class="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm leading-6 text-zinc-200 sm:-mt-2">
					<BookmarkFavicon url={bookmark.url} size={16} />
					<a href={sourceHref} target="_blank" rel="noreferrer" class={domainLinkClass}>
						{domain}
						<span class="sr-only"> (opens in a new tab)</span>
					</a>
					{#if bookmark.tags.length > 0}
						<span class="hidden flex-wrap items-center gap-x-3 sm:flex">
							{#each bookmark.tags as tag (tag)}
								<span>{tag}</span>
							{/each}
						</span>
					{/if}
				</p>
				{#if saved}
					<p class="text-sm leading-6 text-zinc-200 sm:hidden">
						<time datetime={saved.iso}>{saved.label}</time>
					</p>
				{/if}
				{#if bookmark.tags.length > 0}
					<p class="flex flex-wrap gap-x-3 gap-y-1 text-sm leading-6 text-zinc-200 sm:hidden">
						{#each bookmark.tags as tag (tag)}
							<span>{tag}</span>
						{/each}
					</p>
				{/if}
				{#if bookmark.description}
					<p class="line-clamp-2 max-w-[65ch] text-sm leading-6 text-zinc-400">{bookmark.description}</p>
				{/if}
			</div>
		</div>
	</div>
</article>

<style>
	.article-enter {
		animation: fade-up 0.4s ease-out both;
	}

	.bookmark-row {
		opacity: 0.7;
		transition: opacity 150ms ease-out;
	}

	.article-enter:hover .bookmark-row,
	.article-enter:has(:focus-visible) .bookmark-row {
		opacity: 1;
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
