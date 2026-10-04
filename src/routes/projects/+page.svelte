<script lang="ts">
	import ContentLayout from '$components/ContentLayout.svelte';
	import Header from '$components/Header.svelte';
	import ArticleCard from '$components/ArticleCard.svelte';
	import Card from '$components/Card.svelte';
	let { data } = $props();
	let featured = $derived(data.items.find((item) => item.slug === 'exo-lab') ?? data.items[0]);
	let secondary = $derived(
		data.items.filter((item) => ['mars-explorer', 'wikipedia-map'].includes(item.slug))
	);
	let featuredSlugs = $derived(new Set([featured?.slug, ...secondary.map((item) => item.slug)]));
	let remaining = $derived(data.items.filter((item) => !featuredSlugs.has(item.slug)));

	function formatDate(date?: string) {
		return date
			? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(date))
			: 'SOON';
	}
</script>

<svelte:head><title>Projects :: janigowski.dev</title></svelte:head>

<ContentLayout>
	<Header title="Projects" description="Things I've built" />

	{#if featured}
		<div class="mx-auto grid grid-cols-1 gap-8 lg:grid-cols-2">
			<Card>
				<a href={`/projects/${featured.slug}`} class="block h-full">
					<article class="relative h-full min-h-72 w-full p-4 md:p-8">
						<div class="flex items-center justify-between gap-2">
							<time class="text-xs text-zinc-100" datetime={featured.date}>
								{formatDate(featured.date)}
							</time>
						</div>
						<h2
							class="mt-4 font-display text-3xl font-bold text-zinc-100 group-hover:text-white sm:text-4xl"
						>
							{featured.title}
						</h2>
						<p
							class="mt-4 leading-8 text-zinc-400 duration-150 group-hover:text-zinc-300"
						>
							{featured.description}
						</p>
						<p class="absolute bottom-4 hidden text-zinc-200 hover:text-zinc-50 md:bottom-8 lg:block">
							Read more <span aria-hidden="true">→</span>
						</p>
					</article>
				</a>
			</Card>

			<div class="mx-auto flex w-full flex-col gap-8 border-t border-gray-900/10 lg:mx-0 lg:border-t-0">
				{#each secondary as item}
					<Card><ArticleCard {item} /></Card>
				{/each}
			</div>
		</div>
	{/if}

	<div class="hidden h-px w-full bg-zinc-800 md:block"></div>

	<div class="mx-auto grid grid-cols-1 gap-4 md:grid-cols-3 lg:mx-0">
		{#each [0, 1, 2] as column}
			<div class="grid grid-cols-1 gap-4">
				{#each remaining.filter((_, index) => index % 3 === column) as item}
					<Card><ArticleCard {item} /></Card>
				{/each}
			</div>
		{/each}
	</div>
</ContentLayout>
