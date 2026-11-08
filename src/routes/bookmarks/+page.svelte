<script lang="ts">
	import BookmarkCard from '$components/BookmarkCard.svelte';
	import BookmarkFilters from '$components/BookmarkFilters.svelte';
	import BookmarkRowA from '$components/BookmarkRowA.svelte';
	import BookmarkRowB from '$components/BookmarkRowB.svelte';
	import BookmarkRowC from '$components/BookmarkRowC.svelte';
	import ContentLayout from '$components/ContentLayout.svelte';
	import Header from '$components/Header.svelte';

	let { data } = $props();

	const options = [
		{ id: undefined, label: 'Current' },
		{ id: 'a', label: 'A · Media' },
		{ id: 'b', label: 'B · Compact' },
		{ id: 'c', label: 'C · Editorial' }
	] as const;

	const layoutHref = (next?: 'a' | 'b' | 'c') => {
		const params = new URLSearchParams();
		if (next) params.set('layout', next);
		if (data.selectedType) params.set('type', data.selectedType);
		if (data.selectedTag) params.set('tag', data.selectedTag);
		const query = params.toString();
		return query ? `?${query}` : '/bookmarks';
	};

	let listClass = $derived(
		data.layout === 'c'
			? 'flex min-h-screen flex-col gap-10'
			: data.layout
				? 'flex min-h-screen flex-col divide-y divide-white/10'
				: 'grid min-h-screen auto-rows-min divide-y divide-brand-olive/10'
	);

	const optionClass = (active: boolean) =>
		`rounded-full px-3 py-1 transition-colors ${
			active ? 'bg-white font-semibold text-zinc-950' : 'text-zinc-100 ring-1 ring-white/25 hover:bg-white/10'
		}`;
</script>

<svelte:head><title>Bookmarks :: janigowski.dev</title></svelte:head>
<ContentLayout>
	<Header title="Bookmarks" description="Articles, videos, podcasts, and other links." />
	<div class="mb-24">
		<BookmarkFilters
			types={data.types}
			tags={data.tags}
			typeCounts={data.typeCounts}
			tagCounts={data.tagCounts}
			typeTotal={data.typeTotal}
			tagTotal={data.tagTotal}
			selectedType={data.selectedType}
			selectedTag={data.selectedTag}
			layout={data.layout}
		/>
		<nav aria-label="Bookmark layout" class="mt-8 flex flex-wrap items-center gap-2 text-sm">
			{#each options as option (option.label)}
				<a
					href={layoutHref(option.id)}
					data-sveltekit-noscroll
					aria-current={data.layout === option.id ? 'page' : undefined}
					class={optionClass(data.layout === option.id)}
				>
					{option.label}
				</a>
			{/each}
		</nav>
	</div>
	<div class={listClass}>
		{#each data.bookmarks as bookmark (bookmark.slug)}
			{#if data.layout === 'a'}
				<BookmarkRowA {bookmark} />
			{:else if data.layout === 'b'}
				<BookmarkRowB {bookmark} />
			{:else if data.layout === 'c'}
				<BookmarkRowC {bookmark} />
			{:else}
				<BookmarkCard {bookmark} />
			{/if}
		{/each}
		{#if data.bookmarks.length === 0}
			<div class="py-32 text-center">
				<p class="text-lg text-zinc-200">No bookmarks yet.</p>
			</div>
		{/if}
	</div>
</ContentLayout>
