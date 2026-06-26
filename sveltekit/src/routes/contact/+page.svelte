<script lang="ts">
	import ContentLayout from '$components/ContentLayout.svelte';
	import Header from '$components/Header.svelte';
	import Card from '$components/Card.svelte';
	const socials = [{ symbol: '✉', href: 'mailto:dawidjaniga@gmail.com', label: 'Email', handle: 'dawidjaniga@gmail.com' }, { symbol: 'X', href: 'https://x.com/janigowski', label: 'X', handle: '@janigowski' }, { symbol: 'GH', href: 'https://github.com/janigowski', label: 'Github', handle: 'janigowski' }, { symbol: 'in', href: 'https://linkedin.com/in/dawidjaniga', label: 'LinkedIn', handle: 'Dawid Janiga' }];
</script>
<svelte:head><title>Contact :: janigowski.dev</title></svelte:head><ContentLayout><Header title="Contact" description="Let's connect and explore how we can work together. Whether you have a project in mind, want to discuss potential collaboration, or just want to say hello, I'd love to hear from you." /><div class="grid gap-6 sm:grid-cols-2">{#each socials as social}<Card><a href={social.href} target="_blank" rel="noreferrer" class="flex items-center gap-4 p-6"><span class="grid h-10 w-10 place-items-center rounded-full border border-brand-lime text-sm text-brand-lime">{social.symbol}</span><span><span class="block font-medium text-zinc-100">{social.handle}</span><span class="text-sm text-zinc-500">{social.label}</span></span></a></Card>{/each}</div></ContentLayout>
