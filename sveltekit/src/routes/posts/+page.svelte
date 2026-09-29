<script lang="ts">
	import ContentLayout from '$components/ContentLayout.svelte';
	import Header from '$components/Header.svelte';
	import ArticleCard from '$components/ArticleCard.svelte';
	import BookArticle from '$components/BookArticle.svelte';
	import Card from '$components/Card.svelte';
	let { data } = $props();
</script>

<svelte:head><title>Posts & Book Reviews :: janigowski.dev</title></svelte:head>

<ContentLayout>
	<Header title="Posts & Book Reviews" description="Just sharing my perspective on things" />
	<div class="mx-auto flex flex-col space-y-4 lg:mx-0">
		<div class="grid grid-cols-1 gap-4">
			{#each data.items as item}
				<Card>
					{#if item.kind === 'book'}
						<div class="p-4 md:p-8"><BookArticle book={item} /></div>
					{:else}
						<ArticleCard {item} />
					{/if}
				</Card>
			{/each}
		</div>
	</div>
</ContentLayout>
