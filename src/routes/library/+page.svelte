<script lang="ts">
	import ContentLayout from '$components/ContentLayout.svelte';
	import Header from '$components/Header.svelte';
	import BookArticle from '$components/BookArticle.svelte';
	import LibraryStats from '$components/LibraryStats.svelte';
	import BookFilters from '$components/BookFilters.svelte';
	let { data } = $props();
</script>
<svelte:head><title>Library :: janigowski.dev</title></svelte:head>
<ContentLayout>
	<Header title="Library" description="A curated collection of books that have shaped my perspective" />
	<LibraryStats stats={data.stats} />
	<div class="mb-24">
		<BookFilters
			types={data.types}
			tags={data.tags}
			typeCounts={data.typeCounts}
			tagCounts={data.tagCounts}
			total={data.total}
			selectedType={data.selectedType}
			selectedTag={data.selectedTag}
		/>
	</div>
	<div class="grid min-h-screen auto-rows-min divide-y divide-brand-olive/10">
		{#each data.books as item}
			<BookArticle book={item} />
		{/each}
		{#if data.books.length === 0}
			<div class="py-32 text-center">
				<p class="text-lg text-brand-olive">No books found matching your filters.</p>
				<a
					href="/library"
					data-sveltekit-noscroll
					data-sveltekit-keepfocus
					class="mt-4 inline-block text-sm text-brand-olive/80 transition-colors duration-200 hover:text-brand-lime"
				>
					Clear filters
				</a>
			</div>
		{/if}
	</div>
</ContentLayout>
