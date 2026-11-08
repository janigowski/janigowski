<script lang="ts">
	import BookmarkFilters from '$components/BookmarkFilters.svelte';
	import BookmarkRow from '$components/BookmarkRow.svelte';
	import ContentLayout from '$components/ContentLayout.svelte';
	import Header from '$components/Header.svelte';

	let { data } = $props();
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
		/>
	</div>
	<div class="flex min-h-screen flex-col divide-y divide-white/10">
		{#each data.bookmarks as bookmark (bookmark.slug)}
			<BookmarkRow {bookmark} />
		{/each}
		{#if data.bookmarks.length === 0}
			<div class="py-32 text-center">
				<p class="text-lg text-zinc-200">No bookmarks yet.</p>
			</div>
		{/if}
	</div>
</ContentLayout>
