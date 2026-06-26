<script lang="ts">
	import type { Book, Post, Project } from '$content/types';
	let { item } = $props<{ item: Book | Post | Project }>();
	let href = $derived(item.kind === 'book' ? `/library/${item.slug}` : `/${item.kind === 'post' ? 'posts' : 'projects'}/${item.slug}`);
	let date = $derived(item.date ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(item.date)) : undefined);
</script>
<a {href} class="block p-5 hover:bg-zinc-900/60"><article class="space-y-2"><div class="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-zinc-500"><span>{item.kind}</span>{#if date}<time datetime={item.date}>{date}</time>{/if}</div><h2 class="text-xl font-semibold text-zinc-100">{item.title}</h2>{#if item.kind === 'book'}<p class="text-sm text-zinc-400">{item.author} · {item.status} · {item.bookType} · {item.tag}</p>{:else}<p class="text-zinc-400">{item.description}</p>{/if}</article></a>
