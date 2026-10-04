<script lang="ts">
	import ContentLayout from '$components/ContentLayout.svelte';
	import Header from '$components/Header.svelte';
	import ArticleCard from '$components/ArticleCard.svelte';
	import BookArticle from '$components/BookArticle.svelte';
	import Card from '$components/Card.svelte';
	let { data } = $props();
</script>

<ContentLayout>
	<Header
		title="janigowski"
		description="yah-nee-gov-ski"
		descriptionClass="mt-2 text-xl italic"
	/>

	<div class="mx-auto">
		<div class="max-w-none">
			<div class="mb-20">
				<p class="leading-relaxed text-zinc-400">
					I help teams build better products by combining technical expertise with product thinking.
					Through mentoring and speaking, I share insights on software architecture, product development,
					and the intersection of technology and business. Here you'll find my thoughts, learnings, and
					the creative experiments.
				</p>
				<p class="mt-6 text-lg leading-relaxed text-zinc-300">
					Product Engineer · Software Architect · Mentor · Speaker · Creator
				</p>
			</div>

			<div class="grid grid-cols-1 gap-12 md:grid-cols-2">
				<section>
					<div class="mb-6 flex items-center justify-between">
						<h2 class="text-2xl font-bold text-zinc-100">Projects</h2>
						<a
							href="/projects"
							class="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
						>
							All projects →
						</a>
					</div>
					<div class="grid grid-cols-1 gap-4">
						{#each data.randomProjects as item}
							<Card><ArticleCard {item} /></Card>
						{/each}
					</div>
				</section>

				<section>
					<div class="mb-6 flex items-center justify-between">
						<h2 class="text-2xl font-bold text-zinc-100">Posts</h2>
						<a
							href="/posts"
							class="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
						>
							All posts →
						</a>
					</div>
					<div class="grid grid-cols-1 gap-4">
						{#each data.latestPosts as item}
							<Card><ArticleCard {item} /></Card>
						{/each}
					</div>
				</section>
			</div>

			<div class="mt-16 grid grid-cols-1 gap-12 md:grid-cols-2">
				<section>
					<div class="mb-6 flex items-center justify-between">
						<h2 class="text-2xl font-bold text-zinc-100">Reads</h2>
						<a
							href="/library"
							class="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
						>
							All reads →
						</a>
					</div>
					<div class="grid auto-rows-min divide-y divide-brand-olive/10">
						{#each data.latestBooks as item}
							<BookArticle book={item} />
						{/each}
					</div>
				</section>

				<section>
					<div class="mb-6 flex items-center justify-between">
						<h2 class="text-2xl font-bold text-zinc-100">Reviews</h2>
						<a
							href="/library"
							class="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
						>
							All reviews →
						</a>
					</div>
					<div class="grid grid-cols-1 gap-4">
						{#each data.bookReviews as item}
							<BookArticle book={item} />
						{/each}
					</div>
				</section>
			</div>
		</div>
	</div>
</ContentLayout>
