<script lang="ts">
	import type { Book, BookStatus } from '$content/types';

	let { book }: { book: Book } = $props();

	const statusClass: Record<BookStatus, string> = {
		read: 'bg-brand-lime/10 text-brand-lime',
		listened: 'bg-brand-lime/10 text-brand-lime',
		reading: 'bg-brand-indigo/10 text-brand-indigo',
		listening: 'bg-brand-indigo/10 text-brand-indigo',
		waiting: 'bg-brand-olive/10 text-brand-olive',
		paused: 'bg-brand-olive/10 text-brand-olive'
	};

	let href = $derived(`/library/${book.slug}`);
	let date = $derived(
		book.date
			? new Intl.DateTimeFormat('en-US', {
					year: 'numeric',
					month: 'long',
					day: 'numeric'
				}).format(new Date(book.date))
			: undefined
	);
	let hasReview = $derived(
		(book.status === 'read' || book.status === 'listened') && book.body.trim().length > 0
	);
	let isInProgress = $derived(book.status === 'reading' || book.status === 'listening');
</script>

<article
	class="article-enter group relative flex items-start gap-8 py-10 first:pt-0 last:pb-0 {hasReview
		? '-mx-6 rounded-2xl bg-brand-purple-dark/5 px-6'
		: ''}"
>
	<div class="relative aspect-2/3 w-28 flex-none overflow-hidden rounded-lg">
		<img
			src={book.cover}
			alt={book.title}
			class="absolute inset-0 h-full w-full object-contain transition-transform duration-300 will-change-transform group-hover:scale-105"
			width="400"
			height="600"
		/>
	</div>
	<div class="flex min-w-0 flex-auto flex-col">
		<div class="flex items-center gap-4 text-xs">
			<span class="rounded-md px-2 py-1 text-xs font-medium {statusClass[book.status]} {isInProgress ? 'animate-pulse' : ''}">
				{book.status}
			</span>
			<a
				href="/library?type={book.bookType}"
				class="rounded-md bg-brand-purple-darker/10 px-2 py-1 text-xs font-medium text-brand-olive transition-colors duration-300 hover:bg-brand-purple-darker/20"
			>
				{book.bookType}
			</a>
			<a href="/library/mock/{book.slug}" aria-label="View {book.title} mock">_</a>
			{#if hasReview}
				<a
					{href}
					class="group/link ml-auto inline-flex items-center gap-2 text-xs font-medium text-brand-lime transition-colors duration-300 hover:text-brand-lime/80"
				>
					Read review
					<span class="transition-transform duration-300 group-hover/link:translate-x-1">→</span>
				</a>
			{/if}
		</div>
		<h2 class="mt-4 line-clamp-2 text-xl leading-tight font-medium text-white">{book.title}</h2>
		<p class="mt-2 text-base text-brand-olive">{book.author}</p>
		<div class="mt-4 flex items-center gap-4">
			{#if date}
				<time class="text-sm text-brand-olive/80" datetime={book.date}>{date}</time>
			{/if}
			{#if book.tag}
				<a
					href="/library?tag={encodeURIComponent(book.tag)}"
					class="text-sm text-brand-olive/80 transition-colors duration-300 hover:text-brand-olive"
				>
					{book.tag}
				</a>
			{/if}
		</div>
	</div>
</article>

<style>
	.article-enter {
		animation: fade-up 0.4s ease-out both;
	}

	@keyframes fade-up {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.article-enter {
			animation: none;
		}
	}
</style>
