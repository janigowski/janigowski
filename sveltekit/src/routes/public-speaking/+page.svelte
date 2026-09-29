<script lang="ts">
	import CallToAction from '$components/CallToAction.svelte';
	import ConferenceItem from '$components/ConferenceItem.svelte';
	import Keyword from '$components/Keyword.svelte';
	import { talks } from '$lib/data/speaking';
</script>

<svelte:head><title>Speaking :: janigowski.dev</title></svelte:head>

<div class="relative min-h-screen">
	<header class="relative isolate overflow-hidden">
		<div class="container relative isolate mx-auto overflow-hidden py-24 sm:py-32">
			<div class="mx-auto flex max-w-7xl flex-col items-center px-6 text-center lg:px-8">
				<div class="mx-auto max-w-2xl lg:mx-0">
					<h1 class="font-display text-4xl font-bold tracking-tight text-zinc-100 sm:text-6xl">
						Speaking
					</h1>
					<p class="mt-6 text-lg leading-8 text-zinc-400">
						Passionate about sharing knowledge and empowering others through engaging talks and
						discussions. From international conferences to intimate meetups, I bring complex
						technical concepts to life with practical insights and real-world experiences.
					</p>
				</div>
			</div>
		</div>
	</header>
	<article class="prose prose-quoteless mx-auto px-4 py-12">
		<h2
			class="mt-10 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight text-zinc-100 first:mt-0"
		>
			Conference Talks
		</h2>
		<div class="mt-8 flex flex-col divide-y divide-zinc-800">
			{#each talks as talk}
				<ConferenceItem date={talk.date} place={talk.place} conference={talk.conference}>
					{talk.title}
				</ConferenceItem>
			{/each}
		</div>
		<h2
			class="mt-24 scroll-m-20 pb-2 text-center text-3xl font-semibold tracking-tight text-zinc-100"
		>
			Frontend Architecture Area
		</h2>
		<div class="mt-8 text-center text-zinc-300">
			Beyond conferences, I've had the pleasure of hosting <Keyword>100+</Keyword> Frontend
			Architecture Area weekly meetings at Netguru for more than two years.
			<br /><br />
			These sessions have been a melting pot of ideas, where we've explored everything from software
			architecture and product engineering to business development and team building strategies.
		</div>
		<h2
			class="mt-24 scroll-m-20 pb-2 text-center text-3xl font-semibold tracking-tight text-zinc-100"
		>
			Want me to speak at your event?
		</h2>
		<p class="mt-6 text-center leading-7 text-zinc-300">
			I'm always excited to share knowledge and connect with the community. If you'd like me to
			speak at your conference, meetup, or event, let's talk!
		</p>
		<div class="mt-8 text-center">
			<CallToAction href="/contact">Get in touch</CallToAction>
		</div>
	</article>
</div>
