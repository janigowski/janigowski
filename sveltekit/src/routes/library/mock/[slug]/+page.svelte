<script lang="ts">
	import ContentLayout from '$components/ContentLayout.svelte'; let { data } = $props(); let book = $derived(data.book);
</script>
<svelte:head><title>{book.title} :: janigowski.dev</title></svelte:head><ContentLayout><section class="grid min-h-[60vh] place-items-center text-center"><div class="space-y-6"><img src={book.cover} alt="" class="mx-auto max-h-[520px] rounded-2xl border border-white/10 shadow-2xl" /><div><h1 class="font-display text-4xl font-bold text-zinc-100">{book.title}</h1><p class="mt-2 text-zinc-400">{book.author}</p></div></div></section></ContentLayout>
