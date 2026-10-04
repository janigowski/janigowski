<script lang="ts">
	import { Hexagon, Menu, X } from 'lucide-svelte';
	const links = [
		{ href: '/', label: 'Index' },
		{ href: '/projects', label: 'Projects' },
		{ href: '/posts', label: 'Posts' },
		{ href: '/library', label: 'Library' },
		{ href: '/speaking', label: 'Speaking' },
		{ href: '/lamp', label: 'Lamp' },
		{ href: '/contact', label: 'Contact' }
	];
	let isMenuOpen = $state(false);
	let isIntersecting = $state(true);
	let header: HTMLElement;
	let menu: HTMLDivElement;
	let button: HTMLButtonElement;
	let background = $derived(
		isMenuOpen ? 'bg-zinc-900/95' : isIntersecting ? 'bg-zinc-800/40' : 'bg-zinc-800/70'
	);

	$effect(() => {
		const observer = new IntersectionObserver(([entry]) => {
			isIntersecting = entry.isIntersecting;
		});
		observer.observe(header);
		return () => observer.disconnect();
	});

	$effect(() => {
		if (!isMenuOpen) return;
		const closeOnOutsideClick = (event: MouseEvent) => {
			const target = event.target as Node;
			if (!menu.contains(target) && !button.contains(target)) isMenuOpen = false;
		};
		document.addEventListener('mousedown', closeOnOutsideClick);
		return () => document.removeEventListener('mousedown', closeOnOutsideClick);
	});
</script>

<header bind:this={header} class="absolute inset-x-0 top-0 h-px">
	<div
		bind:this={menu}
		class="fixed inset-x-4 top-4 z-50 mx-auto rounded-2xl border border-white/10 shadow-[inset_0_1px_1px_0_hsla(0,0%,100%,.15)] backdrop-blur duration-200 sm:container sm:inset-x-0 {background}"
	>
		<div class="flex items-center justify-between p-6">
			<a href="/" class="text-zinc-300 duration-200 hover:text-zinc-100" aria-label="Home">
				<Hexagon class="h-6 w-6" />
			</a>
			<div class="hidden justify-around gap-8 text-sm md:flex">
				{#each links as link}
					<a href={link.href} class="text-zinc-400 duration-200 hover:text-zinc-100">
						{link.label}
					</a>
				{/each}
			</div>
			<button
				bind:this={button}
				type="button"
				class="text-zinc-400 hover:text-zinc-100 md:hidden"
				aria-label="Toggle menu"
				aria-expanded={isMenuOpen}
				onclick={() => (isMenuOpen = !isMenuOpen)}
			>
				{#if isMenuOpen}<X class="h-6 w-6" />{:else}<Menu class="h-6 w-6" />{/if}
			</button>
		</div>
		{#if isMenuOpen}
			<div class="space-y-4 px-6 pb-6 md:hidden">
				{#each links as link}
					<a
						href={link.href}
						class="block text-zinc-400 duration-200 hover:text-zinc-100"
						onclick={() => (isMenuOpen = false)}
					>
						{link.label}
					</a>
				{/each}
			</div>
		{/if}
	</div>
</header>
