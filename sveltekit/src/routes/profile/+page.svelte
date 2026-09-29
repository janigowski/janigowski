<script lang="ts">
	import AnimatedTitle from '$components/AnimatedTitle.svelte';
	import ContentLayout from '$components/ContentLayout.svelte';

	let { data } = $props();
	let resume = $derived(data.resume);
	let technicalHighlights = $derived(resume.highlights?.technical ?? []);
	let experienceYears = $derived(resume.highlights?.numbers?.experience_years);
	let productsContributed = $derived(resume.highlights?.numbers?.products_contributed);
</script>

<svelte:head><title>Profile :: janigowski.dev</title></svelte:head>

<ContentLayout>
	<header class="relative isolate overflow-hidden">
		<div class="container relative isolate mx-auto overflow-hidden py-24 sm:py-32">
			<div class="mx-auto flex max-w-7xl flex-col items-center px-6 text-center lg:px-8">
				<div class="mx-auto max-w-2xl lg:mx-0">
					<AnimatedTitle text={resume.name} />
					<p class="mt-6 text-lg leading-8 text-zinc-400">{@html resume.role}</p>
					<div class="mt-6 flex justify-center gap-4 text-sm text-zinc-400">
						{#if experienceYears}
							<div class="rounded-md bg-zinc-800/50 px-3 py-1.5">
								<strong>{experienceYears}</strong> years of experience
							</div>
						{/if}
						{#if productsContributed}
							<div class="rounded-md bg-zinc-800/50 px-3 py-1.5">
								<strong>{productsContributed}</strong> products contributed
							</div>
						{/if}
					</div>
					<div class="mt-6 flex flex-wrap justify-center gap-2">
						{#each technicalHighlights as highlight}
							<span
								class="inline-block rounded bg-zinc-800/30 px-3 py-1.5 text-sm text-zinc-400"
							>
								{highlight}
							</span>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</header>

	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="mx-auto max-w-5xl">
			<div class="mb-16 grid grid-cols-1 gap-12 md:grid-cols-[2fr_1fr]">
				<div>
					<h2 class="mb-6 text-2xl font-bold text-zinc-100">About Me</h2>
					<div class="text-lg leading-relaxed text-zinc-300">{@html resume.summary}</div>
				</div>
				<div>
					<h2 class="mb-4 text-xl font-medium text-zinc-100">Clifton Strengths</h2>
					<div class="flex flex-wrap gap-2">
						{#each resume.clifton_strengths ?? [] as strength}
							<span
								class="inline-block rounded bg-zinc-800/20 px-3 py-1.5 text-sm text-zinc-400"
							>
								{strength}
							</span>
						{/each}
					</div>
				</div>
			</div>

			<section class="mb-16">
				<h2 class="mb-6 text-2xl font-bold text-zinc-100">Work Experience</h2>
				{#each resume.work ?? [] as job}
					<article class="mb-16">
						<div class="mb-2 flex flex-col justify-between md:flex-row">
							<h3 class="text-2xl font-semibold text-zinc-100">{job.position}</h3>
							<div class="text-zinc-400">
								{job.startDate} — {job.endDate || 'Present'}
							</div>
						</div>
						<div class="mb-6 text-xl text-zinc-400">{job.name}</div>
						<div class="flex flex-col gap-8 md:flex-row">
							<div class="md:w-2/3">
								{#if job.highlights}
									<div class="mb-6">
										<ul class="list-disc space-y-3 pl-5">
											{#each job.highlights as highlight}
												<li class="text-zinc-300">{@html highlight}</li>
											{/each}
										</ul>
									</div>
								{/if}
								{#if job.projects?.length}
									<div class="mb-6">
										<h4 class="mb-4 text-xl font-semibold text-zinc-200">Projects</h4>
										<div class="space-y-6">
											{#each job.projects as project}
												<div class="rounded-lg border border-zinc-700/50 bg-zinc-800/50 p-6">
													<h5 class="mb-2 text-lg font-medium text-zinc-100">
														{#if project.anchor}
															<a
																href={project.anchor}
																class="transition-colors duration-200 hover:text-zinc-300"
															>
																{project.name}
															</a>
														{:else}
															{project.name}
														{/if}
													</h5>
													{#if project.summary}
														<p class="mb-6 text-zinc-400">{project.summary}</p>
													{/if}
													{#if project.highlights}
														<ul class="list-disc space-y-2 pl-5">
															{#each project.highlights as highlight}
																<li class="text-zinc-300">{@html highlight}</li>
															{/each}
														</ul>
													{/if}
												</div>
											{/each}
										</div>
									</div>
								{/if}
							</div>
							{#if job.skills?.length}
								<div class="md:w-1/3">
									<div class="sticky top-24 rounded-lg border border-zinc-700/30 bg-zinc-800/30 p-5">
										<h4 class="mb-3 text-lg font-medium text-zinc-200">Skills</h4>
										<div class="flex flex-wrap gap-2">
											{#each job.skills as skill}
												<span
													class="inline-block rounded-full bg-zinc-800 px-3 py-1 text-sm text-zinc-300 transition-colors duration-200 hover:bg-zinc-700"
												>
													{skill}
												</span>
											{/each}
										</div>
									</div>
								</div>
							{/if}
						</div>
					</article>
				{/each}
			</section>

			<div class="flex flex-col gap-12 md:flex-row">
				<section class="md:w-1/2">
					<h2 class="mb-6 text-2xl font-bold text-zinc-100">Education</h2>
					{#each resume.education ?? [] as education}
						<div class="mb-4">
							<div class="flex flex-col justify-between md:flex-row">
								<h3 class="text-xl font-medium text-zinc-200">{education.institution}</h3>
								{#if education.year}
									<div class="whitespace-nowrap text-zinc-400">{education.year}</div>
								{/if}
							</div>
							<p class="text-zinc-300">{education.area}</p>
							<p class="text-zinc-400">{education.location}</p>
						</div>
					{/each}
				</section>
				<section class="flex-auto">
					<h2 class="mb-6 text-2xl font-bold text-zinc-100">Interests</h2>
					<div class="flex flex-wrap gap-2">
						{#each resume.interests ?? [] as interest}
							<span
								class="inline-block rounded-full bg-zinc-800 px-3 py-1 text-sm text-zinc-300"
							>
								{interest}
							</span>
						{/each}
					</div>
				</section>
			</div>
		</div>
	</div>
</ContentLayout>
