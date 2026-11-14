<script lang="ts">
	import AnimatedTitle from '$components/AnimatedTitle.svelte';
	import Comments from '$components/Comments.svelte';
	import ListeningDays from '$components/ListeningDays.svelte';
	import Nav from '$components/Nav.svelte';
	import ReadingProgressChart from '$components/ReadingProgressChart.svelte';
	import { listeningDayCount, readingDayLabel, warsawToday } from '$content/reading';
	import type { BookStatus } from '$content/types';

	let { data } = $props();
	let book = $derived(data.book);
	const statusClass: Record<BookStatus, string> = {
		read: 'bg-brand-lime/10 text-brand-lime',
		listened: 'bg-brand-lime/10 text-brand-lime',
		reading: 'bg-brand-indigo/10 text-brand-indigo',
		listening: 'bg-brand-indigo/10 text-brand-indigo',
		waiting: 'bg-brand-olive/10 text-brand-olive',
		paused: 'bg-brand-olive/10 text-brand-olive'
	};
	let isInProgress = $derived(book.status === 'reading' || book.status === 'listening');
	let listeningDays = $derived(listeningDayCount(book.listening));
	let readingLabel = $derived(
		book.readingHistory?.length
			? readingDayLabel(book.readingHistory, book.status, warsawToday())
			: undefined
	);
	let date = $derived(
		book.date
			? new Intl.DateTimeFormat('en-US', {
					year: 'numeric',
					month: 'long',
					day: 'numeric'
				}).format(new Date(book.date))
			: undefined
	);
</script>

<svelte:head><title>{book.title} :: janigowski.dev</title></svelte:head>

<div class="min-h-screen">
	<Nav />
	<header class="relative isolate overflow-hidden">
		<div class="container relative isolate mx-auto overflow-hidden py-24 sm:py-32">
			<div class="mx-auto flex max-w-7xl flex-col items-center px-6 text-center lg:px-8">
				<div class="mx-auto max-w-2xl lg:mx-0">
					<div class="mb-6 flex items-center justify-center gap-4">
						<span
							class="rounded-md px-2 py-1 text-xs font-medium opacity-100 transition-opacity duration-1000 {statusClass[
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
					<AnimatedTitle text={book.title} />
					<p class="mt-4 text-lg font-medium text-brand-olive">{book.author}</p>
					{#if date}
						<time class="mt-2 block text-sm text-brand-olive/80" datetime={book.date}>
							{date}
						</time>
					{/if}
				</div>
			</div>
		</div>
	</header>
	{#if book.html}
		{#if listeningDays !== undefined}
			<div class="mx-auto w-full max-w-2xl px-6 pt-4">
				<ListeningDays days={listeningDays} />
			</div>
		{:else if book.readingHistory?.length}
			<div class="mx-auto w-full max-w-2xl px-6 pt-4">
				{#if readingLabel}
					<div class="mb-2">
						<ListeningDays label={readingLabel} />
					</div>
				{/if}
				<ReadingProgressChart
					history={book.readingHistory}
					totalPages={book.totalPages}
					title={book.title}
				/>
			</div>
		{/if}
		<article class="prose prose-quoteless mx-auto px-4 py-12">
			{@html book.html}
			<Comments />
		</article>
	{:else}
		<p class="mx-auto max-w-3xl px-4 py-12 text-zinc-400">No review yet.</p>
	{/if}
</div>
