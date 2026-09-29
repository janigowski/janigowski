<script lang="ts">
	import ContentLayout from '$components/ContentLayout.svelte';
	import Header from '$components/Header.svelte';
	import Card from '$components/Card.svelte';
	import { Contact, GitBranch, Mail, X } from 'lucide-svelte';

	const socials = [
		{
			icon: Mail,
			href: 'mailto:dawidjaniga@gmail.com',
			label: 'Email',
			handle: 'dawidjaniga@gmail.com'
		},
		{
			icon: X,
			href: 'https://x.com/janigowski',
			label: 'X',
			handle: '@janigowski'
		},
		{
			icon: GitBranch,
			href: 'https://github.com/janigowski',
			label: 'Github',
			handle: 'janigowski'
		},
		{
			icon: Contact,
			href: 'https://linkedin.com/in/dawidjaniga',
			label: 'LinkedIn',
			handle: 'Dawid Janiga'
		}
	];
</script>

<svelte:head><title>Contact :: janigowski.dev</title></svelte:head>

<ContentLayout>
	<Header
		title="Contact"
		description="Let's connect and explore how we can work together. Whether you have a project in mind, want to discuss potential collaboration, or just want to say hello, I'd love to hear from you."
	/>
	<div
		class="mx-auto mb-32 grid w-full grid-cols-1 justify-center gap-8 px-4 pb-12 sm:mt-0 sm:grid-cols-2 lg:gap-16"
	>
		{#each socials as social}
			{@const Icon = social.icon}
			<Card>
				<a
					href={social.href}
					target="_blank"
					rel="noreferrer"
					class="group relative flex flex-col items-center gap-4 p-4 duration-700 md:gap-8 md:p-16 md:py-24 lg:pb-16"
				>
					<span
						class="absolute h-2/3 w-px bg-gradient-to-b from-zinc-500 via-zinc-500/50 to-transparent"
						aria-hidden="true"
					></span>
					<span
						class="drop-shadow-orange relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-zinc-500 bg-zinc-900 text-sm text-zinc-200 duration-1000 group-hover:border-zinc-200 group-hover:bg-zinc-900 group-hover:text-white"
					>
						<Icon size={20} />
					</span>
					<div class="z-10 flex flex-col items-center">
						<span
							class="font-display font-medium text-zinc-200 duration-150 group-hover:text-white lg:text-xl xl:text-3xl"
						>
							{social.handle}
						</span>
						<span
							class="mt-4 text-center text-sm text-zinc-400 duration-1000 group-hover:text-zinc-200"
						>
							{social.label}
						</span>
					</div>
				</a>
			</Card>
		{/each}
	</div>
</ContentLayout>
