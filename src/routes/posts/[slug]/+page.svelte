<script lang="ts">
	import type { Component } from 'svelte';
	import AnimatedTitle from '$components/AnimatedTitle.svelte';
	import Comments from '$components/Comments.svelte';
	import Nav from '$components/Nav.svelte';

	type MdxModule = { default: Component };

	const postModules = import.meta.glob<MdxModule>('../../../../content/posts/*.mdx', { eager: true });

	let { data } = $props();
	let item = $derived(data.item);
	let PostBody = $derived.by(() => {
		if (!item.body.trimStart().startsWith('<script')) return undefined;
		const key = Object.keys(postModules).find((path) => path.endsWith(`/posts/${item.slug}.mdx`));
		return key ? postModules[key].default : undefined;
	});
	let date = $derived(
		item.date
			? new Intl.DateTimeFormat('en-US', {
					year: 'numeric',
					month: 'long',
					day: 'numeric'
				}).format(new Date(item.date))
			: undefined
	);
</script>

<svelte:head><title>{item.title} :: janigowski.dev</title></svelte:head>

<div class="min-h-screen">
	<Nav />
	<header class="relative isolate overflow-hidden">
		<div class="container relative isolate mx-auto overflow-hidden py-24 sm:py-32">
			<div class="mx-auto flex max-w-7xl flex-col items-center px-6 text-center lg:px-8">
				<div class="mx-auto max-w-2xl lg:mx-0">
					<AnimatedTitle text={item.title} />
					{#if date}
						<time class="mt-4 block text-sm text-zinc-400" datetime={item.date}>{date}</time>
					{/if}
					<p class="mt-6 text-lg leading-8 text-zinc-400">{item.description}</p>
				</div>
			</div>
		</div>
	</header>
	<article class="prose prose-quoteless mx-auto px-4 py-12">
		{#if PostBody}
			<PostBody />
		{:else}
			{@html item.html}
		{/if}
		<Comments />
	</article>

<style>
	article :global(.subheading-anchor) {
		display: none;
	}
</style>
</div>
