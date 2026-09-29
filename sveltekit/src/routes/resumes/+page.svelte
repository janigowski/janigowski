<script lang="ts">
	let { data } = $props();
	const format = (slug: string) =>
		slug
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
</script>

<svelte:head><title>Resumes :: janigowski.dev</title></svelte:head>

<div class="relative min-h-screen">
	<header class="relative isolate overflow-hidden">
		<div class="container relative isolate mx-auto overflow-hidden py-24 sm:py-32">
			<div class="mx-auto flex max-w-7xl flex-col items-center px-6 text-center lg:px-8">
				<div class="mx-auto max-w-2xl lg:mx-0">
					<h1 class="font-display text-4xl font-bold tracking-tight text-zinc-100 sm:text-6xl">
						Resumes
					</h1>
					<p class="mt-6 text-lg leading-8 text-zinc-400">
						Collection of my professional resumes
					</p>
				</div>
			</div>
		</div>
	</header>
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="mx-auto max-w-2xl lg:max-w-none">
			{#if data.resumes.length === 0}
				<p class="text-zinc-400">No resumes available.</p>
			{:else}
				<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
					{#each data.resumes as resume}
						<a
							href={`/resumes/${resume.slug}`}
							class="group relative flex flex-col items-start rounded-lg bg-zinc-900/50 p-6 transition hover:bg-zinc-900/75"
						>
							<h2
								class="text-xl font-semibold text-zinc-100 transition group-hover:text-brand-lime"
							>
								{format(resume.slug)}
							</h2>
							{#if resume.resolvedResume.summary}
								<p class="mt-4 line-clamp-3 text-sm text-zinc-400">
									{resume.resolvedResume.summary.replace(/<[^>]*>/g, '')}
								</p>
							{/if}
							<div class="mt-4 text-xs text-zinc-500">
								{resume.resolvedResume.label ?? format(resume.slug)} • {resume.resolvedResume
									.locationCity}, {resume.resolvedResume.locationCountryCode}
							</div>
						</a>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
