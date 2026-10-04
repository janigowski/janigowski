<script lang="ts">
	import AnimatedTitle from '$components/AnimatedTitle.svelte';
	import Comments from '$components/Comments.svelte';
	import Nav from '$components/Nav.svelte';
	let { data } = $props();
	let item = $derived(data.item);
</script>

<svelte:head><title>{item.title} :: janigowski.dev</title></svelte:head>

<div class="min-h-screen">
	<Nav />
	<header class="relative isolate mt-20 overflow-hidden">
		<div class="container relative isolate mx-auto overflow-hidden py-32">
			<div class="mx-auto flex max-w-7xl flex-col items-center px-6 text-center lg:px-8">
				<div class="mx-auto max-w-2xl lg:mx-0">
					<AnimatedTitle text={item.title} />
					<p class="mt-6 text-lg leading-8 text-zinc-400">{item.description}</p>
				</div>
				{#if item.repository || item.url}
					<div class="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
						<div
							class="grid grid-cols-1 gap-x-8 gap-y-6 text-base leading-7 font-semibold text-zinc-100 sm:grid-cols-2 md:flex lg:gap-x-10"
						>
							{#if item.repository}
								<a
									target="_blank"
									rel="noreferrer"
									href={`https://github.com/${item.repository}`}
								>
									GitHub <span aria-hidden="true">→</span>
								</a>
							{/if}
							{#if item.url}
								<a target="_blank" rel="noreferrer" href={item.url}>
									Website <span aria-hidden="true">→</span>
								</a>
							{/if}
						</div>
					</div>
				{/if}
			</div>
		</div>
	</header>
	<article class="prose prose-quoteless mx-auto px-4 pb-12">
		{@html item.html}
		<Comments />
	</article>
</div>
