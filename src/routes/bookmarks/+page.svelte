<script lang="ts">
	import BookmarkFilters from '$components/BookmarkFilters.svelte';
	import BookmarkRow from '$components/BookmarkRow.svelte';
	import ContentLayout from '$components/ContentLayout.svelte';
	import Header from '$components/Header.svelte';

	let { data } = $props();
</script>

<svelte:head><title>Bookmarks :: janigowski.dev</title></svelte:head>
<ContentLayout>
	<Header
		title="Bookmarks"
		description="Materials I've learned from over the years and found useful. I keep them here so I can find them again easily, and share them in case they help you too."
	/>
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
	<div class="flex min-h-screen flex-col gap-12 divide-y divide-brand-olive/10 sm:gap-16">
		{#each data.bookmarks as bookmark (bookmark.slug)}
			<BookmarkRow {bookmark} />
		{/each}
		{#if data.bookmarks.length === 0}
			<div class="py-32 text-center">
				<p class="text-lg text-brand-olive">No bookmarks yet.</p>
			</div>
		{/if}
	</div>
</ContentLayout>
