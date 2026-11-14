<script lang="ts">
	import ListeningDays from '$components/ListeningDays.svelte';
	import ReadingProgressChart from '$components/ReadingProgressChart.svelte';
	import { listeningDayCount, readingDayLabel, warsawToday } from '$content/reading';
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
	let readPercent = $derived.by(() => {
		const { pagesRead, totalPages } = book;
		if (typeof pagesRead !== 'number' || typeof totalPages !== 'number') return undefined;
		if (!Number.isFinite(pagesRead) || !Number.isFinite(totalPages) || totalPages <= 0) return undefined;
		return Math.round((pagesRead / totalPages) * 100);
	});
	let barWidth = $derived(readPercent === undefined ? 0 : Math.min(100, Math.max(0, readPercent)));
	let hasHistory = $derived((book.readingHistory?.length ?? 0) > 0);
	let listeningDays = $derived(listeningDayCount(book.listening));
	let showChart = $derived(hasHistory && listeningDays === undefined);
	let readingLabel = $derived(
		showChart ? readingDayLabel(book.readingHistory, book.status, warsawToday()) : undefined
	);
</script>

<article
	class="article-enter group relative grid grid-cols-1 items-start gap-y-5 py-10 first:pt-0 last:pb-0 md:items-center {showChart ||
	listeningDays !== undefined
		? 'md:grid-cols-2 md:gap-x-8'
		: ''} {hasReview ? '-mx-6 rounded-2xl bg-brand-purple-dark/5 px-6' : ''}"
>
	<div class="flex min-w-0 items-start gap-6 sm:gap-8">
	<div class="relative aspect-2/3 w-24 flex-none overflow-hidden rounded-lg sm:w-28">
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
		{#if readPercent !== undefined && !showChart && listeningDays === undefined}
			<div class="mt-4 flex items-center gap-3">
				<div
					class="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-brand-olive/25"
					role="progressbar"
					aria-valuenow={readPercent}
					aria-valuemin={0}
					aria-valuemax={100}
					aria-valuetext="{readPercent}% read"
					aria-label="Reading progress"
				>
					<div class="h-full rounded-full bg-brand-lime" style:width="{barWidth}%"></div>
				</div>
				<span class="shrink-0 text-xs font-medium text-brand-lime tabular-nums">{readPercent}%</span>
			</div>
		{/if}
	</div>
	</div>
	{#if listeningDays !== undefined}
		<div class="flex min-w-0 items-center md:justify-end">
			<ListeningDays days={listeningDays} />
		</div>
	{:else if showChart}
		<div class="flex min-w-0 flex-col gap-2">
			{#if readingLabel}
				<div class="md:text-right">
					<ListeningDays label={readingLabel} />
				</div>
			{/if}
			<ReadingProgressChart
				inline
				history={book.readingHistory ?? []}
				totalPages={book.totalPages}
				title={book.title}
			/>
		</div>
	{/if}
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
