<script lang="ts">
	import ContentLayout from '$components/ContentLayout.svelte';
	import Comments from '$components/Comments.svelte';
	let { data } = $props();
	let item = $derived(data.item);
</script>
<svelte:head><title>{item.title} :: janigowski.dev</title></svelte:head><ContentLayout><header class="max-w-3xl"><p class="text-sm uppercase tracking-wide text-zinc-500">post</p><h1 class="mt-3 font-display text-4xl font-bold text-zinc-100 sm:text-6xl">{item.title}</h1>{#if item.description}<p class="mt-6 text-lg text-zinc-400">{item.description}</p>{/if}{#if item.date}<time class="mt-4 block text-sm text-zinc-500" datetime={item.date}>{new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(item.date))}</time>{/if}</header><article class="prose prose-invert max-w-3xl">{@html item.html}</article><Comments /></ContentLayout>
