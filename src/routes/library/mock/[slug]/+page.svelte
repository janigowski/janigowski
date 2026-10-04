<script lang="ts">
	import type { BookStatus } from '$content/types';

	let { data } = $props();
	let book = $derived(data.book);
	let mainColor = $state('#18181b');
	const statusClass: Record<BookStatus, string> = {
		read: 'bg-brand-lime/10 text-brand-lime',
		listened: 'bg-brand-lime/10 text-brand-lime',
		reading: 'bg-brand-indigo/10 text-brand-indigo',
		listening: 'bg-brand-indigo/10 text-brand-indigo',
		waiting: 'bg-brand-olive/10 text-brand-olive',
		paused: 'bg-brand-olive/10 text-brand-olive'
	};
	let isInProgress = $derived(book.status === 'reading' || book.status === 'listening');
	let date = $derived(
		book.date
			? new Intl.DateTimeFormat('en-US', {
					year: 'numeric',
					month: 'long',
					day: 'numeric'
				}).format(new Date(book.date))
			: undefined
	);

	function extractColor(event: Event) {
		const image = event.currentTarget as HTMLImageElement;
		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d');
		if (!context) return;
		canvas.width = 32;
		canvas.height = 32;
		context.drawImage(image, 0, 0, 32, 32);
		const pixels = context.getImageData(0, 0, 32, 32).data;
		let red = 0;
		let green = 0;
		let blue = 0;
		let count = 0;
		for (let index = 0; index < pixels.length; index += 16) {
			if (pixels[index + 3] < 128) continue;
			red += pixels[index];
			green += pixels[index + 1];
			blue += pixels[index + 2];
			count += 1;
		}
		if (count) {
			mainColor = `rgb(${Math.round(red / count)} ${Math.round(green / count)} ${Math.round(
				blue / count
			)})`;
		}
	}
</script>

<svelte:head><title>{book.title} :: janigowski.dev</title></svelte:head>

<div
	class="min-h-screen w-full"
	style:background={`linear-gradient(to bottom, #18181b, ${mainColor}, #09090b)`}
>
	<header class="relative isolate overflow-hidden">
		<div class="container relative isolate mx-auto overflow-hidden py-24 sm:py-32">
			<div class="mx-auto flex max-w-7xl flex-col items-center px-6 text-center lg:px-8">
				<div class="mx-auto max-w-2xl lg:mx-0">
					<div class="mb-6 flex items-center justify-center gap-4">
						<span
							class="rounded-md px-2 py-1 text-xs font-medium transition-opacity duration-1000 {statusClass[
								book.status
							]} {isInProgress ? 'animate-pulse' : ''}"
						>
							{book.status}
						</span>
						{#if book.tag}
							<span
								class="rounded-md bg-brand-purple-darker/10 px-2 py-1 text-xs font-medium text-brand-olive"
							>
								{book.tag}
							</span>
						{/if}
					</div>
					<h1 class="font-display text-4xl font-bold tracking-tight text-white sm:text-6xl">
						{book.title}
					</h1>
					<p class="mt-4 text-lg font-medium text-brand-olive">{book.author}</p>
					{#if date}
						<time class="mt-2 block text-sm text-brand-olive/80" datetime={book.date}>
							{date}
						</time>
					{/if}
					<img
						src={book.cover}
						alt={book.title}
						class="mx-auto mt-8 max-h-[60vh] w-auto rounded-lg object-contain shadow-2xl"
						width="400"
						height="600"
						onload={extractColor}
					/>
				</div>
			</div>
		</div>
	</header>
</div>
