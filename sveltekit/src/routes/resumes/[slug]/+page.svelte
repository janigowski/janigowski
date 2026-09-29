<script lang="ts">
	import { Contact, GitBranch, Globe, Mail, MapPin } from 'lucide-svelte';

	let { data } = $props();
	let resume = $derived(data.resume);
	let names = $derived(resume.name.split(' '));
	let github = $derived(resume.profiles.find((profile) => profile.network === 'GitHub')?.url);
	let linkedin = $derived(
		resume.profiles.find((profile) => profile.network === 'LinkedIn')?.url
	);
</script>

<svelte:head><title>{resume.name} :: janigowski.dev</title></svelte:head>

<article class="mx-auto min-h-[297mm] max-w-[210mm] bg-white text-zinc-800 print:max-w-none">
	<header class="relative mb-8 break-inside-avoid">
		<div class="relative z-10 flex items-start justify-between px-10 py-6">
			<div class="flex flex-col justify-between">
				<h1 class="mb-6 px-2 font-display text-3xl leading-none font-bold tracking-tight text-white">
					{names.join(' ')}
				</h1>
				<div class="mb-4 px-2 text-xs text-zinc-200">{@html resume.role}</div>
				<div class="mb-4 flex gap-4 text-xs text-zinc-400">
					{#if resume.highlights?.numbers?.experience_years}
						<div class="rounded-md bg-zinc-800/50 px-2 py-1">
							<strong>{resume.highlights.numbers.experience_years}</strong> years of experience
						</div>
					{/if}
					{#if resume.highlights?.numbers?.products_contributed}
						<div class="rounded-md bg-zinc-800/50 px-2 py-1">
							<strong>{resume.highlights.numbers.products_contributed}</strong> products contributed
						</div>
					{/if}
				</div>
				<div class="flex flex-wrap gap-2 text-xs text-zinc-500">
					{#each resume.highlights?.technical ?? [] as skill}
						<span class="rounded-md bg-zinc-900/20 px-2 py-1">{skill}</span>
					{/each}
				</div>
			</div>
			<div
				class="flex w-[180px] self-stretch flex-col justify-between text-right text-xs text-zinc-400"
			>
				{#if linkedin}
					<a
						href={linkedin}
						target="_blank"
						rel="noreferrer"
						class="flex items-center justify-start gap-4"
					>
						<Contact class="h-4 w-4" />
						<span>{linkedin.split('/').filter(Boolean).pop()}</span>
					</a>
				{/if}
				<a
					href={resume.url}
					target="_blank"
					rel="noreferrer"
					class="flex items-center justify-start gap-4"
				>
					<Globe class="h-4 w-4" />
					<span>{resume.url.replace('https://', '')}</span>
				</a>
				<a href={`mailto:${resume.email}`} class="flex items-center justify-start gap-4">
					<Mail class="h-4 w-4" />
					<span>{resume.email}</span>
				</a>
				{#if github}
					<a
						href={github}
						target="_blank"
						rel="noreferrer"
						class="flex items-center justify-start gap-4"
					>
						<GitBranch class="h-4 w-4" />
						<span>{github.split('/').filter(Boolean).pop()}</span>
					</a>
				{/if}
				<div class="flex items-center justify-start gap-4">
					<MapPin class="h-4 w-4" />
					<span>{resume.locationCity}, {resume.locationCountryCode}</span>
				</div>
			</div>
		</div>
		<div class="absolute inset-0 z-0">
			<img
				src="/janigowski-large-wallpaper.jpg"
				alt=""
				class="h-full w-full object-cover"
			/>
		</div>
	</header>

	<div class="px-12">
		<div class="mb-4 grid grid-cols-[1fr_180px] gap-8">
			{#if resume.summary}
				<section>
					<div class="relative h-2">
						<hr class="absolute inset-x-0 top-0 border-zinc-300" />
						<hr class="absolute inset-x-0 top-0 w-10 border-zinc-800" />
					</div>
					<h2 class="mb-4 text-sm font-semibold text-zinc-800 uppercase">About me</h2>
					<div class="text-xs leading-relaxed text-zinc-600">{@html resume.summary}</div>
				</section>
			{/if}

			<section>
				<div class="relative h-2">
					<hr class="absolute inset-x-0 top-0 border-zinc-300" />
					<hr class="absolute inset-x-0 top-0 w-10 border-zinc-800" />
				</div>
				<h2 class="mb-4 text-sm font-semibold text-zinc-800 uppercase">Clifton Strengths</h2>
				<div class="flex flex-wrap gap-2">
					{#each resume.clifton_strengths ?? [] as strength}
						<span class="inline-block rounded bg-zinc-100 px-2 py-1 text-xs text-zinc-500">
							{strength}
						</span>
					{/each}
				</div>
			</section>
		</div>

		{#if resume.work?.length}
			<section class="mb-8">
				<div class="relative h-2">
					<hr class="absolute inset-x-0 top-0 border-zinc-300" />
					<hr class="absolute inset-x-0 top-0 w-10 border-zinc-800" />
				</div>
				<h2 class="mb-4 text-sm font-semibold text-zinc-800 uppercase">Experience</h2>
				{#each resume.work as job}
					<article class="mb-8 break-inside-avoid">
						<h3 class="py-1 text-sm font-bold text-zinc-950 uppercase">{job.position}</h3>
						<div class="grid w-full grid-cols-[1fr_180px] gap-6">
							<div>
								<div class="mb-2 flex justify-between">
									<span class="text-xs text-zinc-500">{job.name}</span>
									<div class="text-xs text-zinc-500">
										{job.startDate} - {job.endDate || 'Present'}
									</div>
								</div>
								<div class="text-xs leading-relaxed text-zinc-600">
									{#if job.highlights}
										<ul class="mt-2 ml-8 list-outside list-disc">
											{#each job.highlights as highlight}
												<li>{@html highlight}</li>
											{/each}
										</ul>
									{/if}
									{#if job.projects?.length}
										<div class="mt-4">
											<h4 class="mb-2 font-medium text-zinc-600">Projects</h4>
											<div class="space-y-1">
												{#each job.projects as project}
													<div>
														<h5 class="ml-4 text-zinc-700">
															<span class="italic">
																{#if project.anchor}
																	<a class="underline underline-offset-2" href={project.anchor}>
																		{project.name}
																	</a>
																{:else}
																	{project.name}
																{/if}
															</span>
															{#if project.summary}
																<span class="text-xs text-zinc-500">: {project.summary}</span>
															{/if}
														</h5>
														{#if project.highlights?.length}
															<ul class="mt-1 mb-4 ml-8 list-outside list-disc">
																{#each project.highlights as highlight}
																	<li>{@html highlight}</li>
																{/each}
															</ul>
														{/if}
													</div>
												{/each}
											</div>
										</div>
									{/if}
								</div>
							</div>
							<div class="space-y-4">
								{#if job.skills}
									<div class="flex flex-wrap gap-2">
										{#each job.skills as skill}
											<span
												class="inline-block rounded bg-zinc-50 px-2 py-1 text-xs text-zinc-500"
											>
												{skill}
											</span>
										{/each}
									</div>
								{/if}
							</div>
						</div>
					</article>
				{/each}
			</section>
		{/if}

		<div class="grid grid-cols-[47%_53%] gap-8">
			<div class="space-y-8">
				{#if resume.education?.length}
					<section class="break-inside-avoid">
						<div class="relative h-2">
							<hr class="absolute inset-x-0 top-0 border-zinc-300" />
							<hr class="absolute inset-x-0 top-0 w-10 border-zinc-800" />
						</div>
						<h2 class="mb-4 text-sm font-semibold text-zinc-800 uppercase">Education</h2>
						<div class="text-xs">
							{#each resume.education as item}
								<div class="space-y-2">
									<h3 class="font-semibold text-zinc-800">{item.area}</h3>
									<p class="text-zinc-500">{item.institution} {item.location}</p>
									{#if item.year}<p class="text-zinc-400">{item.year}</p>{/if}
								</div>
							{/each}
						</div>
					</section>
				{/if}
				{#if resume.interests?.length}
					<section class="break-inside-avoid">
						<div class="relative h-2">
							<hr class="absolute inset-x-0 top-0 border-zinc-300" />
							<hr class="absolute inset-x-0 top-0 w-10 border-zinc-800" />
						</div>
						<h2 class="mb-4 text-sm font-semibold text-zinc-800 uppercase">Interests</h2>
						<div class="grid grid-cols-2 gap-2">
							{#each resume.interests as interest}
								<div class="text-xs text-zinc-600">{interest}</div>
							{/each}
						</div>
					</section>
				{/if}
			</div>
			{#if resume.courses?.length}
				<section class="break-inside-avoid">
					<div class="relative h-2">
						<hr class="absolute inset-x-0 top-0 border-zinc-300" />
						<hr class="absolute inset-x-0 top-0 w-10 border-zinc-800" />
					</div>
					<h2 class="mb-4 text-sm font-semibold text-zinc-800 uppercase">Courses</h2>
					<ul class="ml-6 list-outside list-disc space-y-2">
						{#each resume.courses as course}
							<li class="text-xs text-zinc-600">{course}</li>
						{/each}
					</ul>
				</section>
			{/if}
		</div>
	</div>
</article>
