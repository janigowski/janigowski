<script lang="ts">
	let { title, description, centered = false } = $props<{ title: string; description?: string; centered?: boolean }>();
</script>
<header class="py-12 sm:py-20 {centered ? 'text-center' : ''}"><h1 class="font-display text-4xl font-bold tracking-tight text-zinc-100 sm:text-6xl">{title}</h1>{#if description}<p class="mt-6 max-w-2xl text-lg leading-8 text-zinc-400 {centered ? 'mx-auto' : ''}">{description}</p>{/if}</header>
