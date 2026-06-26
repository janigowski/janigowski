<script lang="ts">
	import ContentLayout from '$components/ContentLayout.svelte';
	import Header from '$components/Header.svelte';
	import ArticleCard from '$components/ArticleCard.svelte';
	import Card from '$components/Card.svelte';
	let { data } = $props();
</script>
<svelte:head><title>Projects :: janigowski.dev</title></svelte:head><ContentLayout><Header title="Projects" description="Things I've built" /><div class="grid gap-4 md:grid-cols-2">{#each data.items as item}<Card><ArticleCard {item} /></Card>{/each}</div></ContentLayout>
