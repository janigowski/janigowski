<script lang="ts">
	import AnimatedTitle from '$components/AnimatedTitle.svelte';
	import BookmarkFavicon from '$components/BookmarkFavicon.svelte';
	import Comments from '$components/Comments.svelte';
	import Nav from '$components/Nav.svelte';
	import { bookmarkSourceHref, formatCalendarDate, hasNote } from '$content/bookmarks';
	import type { BookmarkType } from '$content/types';

	let { data } = $props();
	let bookmark = $derived(data.bookmark);
	let saved = $derived(formatCalendarDate(bookmark.date));
	let source = $derived(formatCalendarDate(bookmark.sourceDate));
	let note = $derived(hasNote(bookmark.body));
	let sourceHref = $derived(bookmarkSourceHref(bookmark.url));
	const labels: Record<BookmarkType, string> = {
		article: 'Read article',
		video: 'Watch',
		podcast: 'Listen',
		link: 'Open link'
	};
	let linkLabel = $derived(labels[bookmark.bookmarkType]);
</script>

<svelte:head><title>{bookmark.title} :: janigowski.dev</title></svelte:head>

<div class="min-h-screen">
	<Nav />
	<header class="relative isolate overflow-hidden">
		<div class="container relative isolate mx-auto overflow-hidden py-24 sm:py-32">
			<div class="mx-auto flex max-w-7xl flex-col items-center px-6 text-center lg:px-8">
				<div class="mx-auto max-w-2xl lg:mx-0">
					<div class="mb-6 flex flex-wrap items-center justify-center gap-4">
						<a
							href="/bookmarks?type={bookmark.bookmarkType}"
							class="rounded-md bg-brand-purple-darker/10 px-2 py-1 text-xs font-medium text-brand-olive"
						>
							{bookmark.bookmarkType}
						</a>
						{#each bookmark.tags as tag (tag)}
							<a
								href="/bookmarks?tag={encodeURIComponent(tag)}"
								class="rounded-md bg-brand-purple-darker/10 px-2 py-1 text-xs font-medium text-brand-olive"
							>
								{tag}
							</a>
						{/each}
					</div>
					<AnimatedTitle text={bookmark.title} />
					{#if bookmark.author}
						<p class="mt-4 text-lg font-medium text-brand-olive">{bookmark.author}</p>
					{/if}
					{#if saved}
						<time class="mt-2 block text-sm text-brand-olive/80" datetime={saved.iso}>{saved.label}</time>
					{/if}
					{#if source}
						<p class="mt-1 text-sm text-brand-olive/60">Source {source.label}</p>
					{/if}
					<a
						href={sourceHref}
						target="_blank"
						rel="noreferrer"
						class="mt-8 inline-flex items-center gap-2 text-base font-semibold text-zinc-100"
					>
						<BookmarkFavicon url={bookmark.url} />
						{linkLabel} <span aria-hidden="true">→</span>
					</a>
				</div>
			</div>
		</div>
	</header>
	{#if note}
		<article class="prose prose-quoteless mx-auto px-4 py-12">
			{@html bookmark.html}
			<Comments />
		</article>
	{/if}
</div>
