<script lang="ts">
	import ContentLayout from '$components/ContentLayout.svelte';
	import Header from '$components/Header.svelte';
</script>

<svelte:head><title>Mentoring :: janigowski.dev</title></svelte:head>

<ContentLayout>
	<Header
		centered
		title="Mentoring"
		description="Elevate your craft through personalized guidance and collaborative problem-solving"
	/>
	<article class="prose prose-quoteless mx-auto max-w-2xl px-4 py-12">
		<p class="leading-7 text-zinc-300">
			Drawing from my experience as a Product Engineer and Software Architect, I offer focused
			mentoring sessions to help you navigate technical challenges and accelerate your professional
			growth.
		</p>

		<h2 class="mt-10 scroll-m-20 pb-1 text-3xl font-semibold tracking-tight text-zinc-100">
			Areas of Focus
		</h2>
		<ul class="my-6 ml-6 space-y-4">
			<li>Software Architecture & System Design</li>
			<li>Frontend Engineering</li>
			<li>Product Development & Technical Leadership</li>
			<li>Career Growth & Team Building</li>
		</ul>

		<h2 class="mt-10 scroll-m-20 pb-1 text-3xl font-semibold tracking-tight text-zinc-100">
			What to Expect
		</h2>
		<p class="leading-7 text-zinc-300">
			Each session is tailored to your specific needs and challenges. Whether you're looking to
			level up your technical skills, navigate architectural decisions, or grow as a technical
			leader, we'll work together to find practical solutions and actionable insights.
		</p>

		<h2 class="mt-10 scroll-m-20 pb-1 text-3xl font-semibold tracking-tight text-zinc-100">
			Contribution
		</h2>
		<p class="leading-7 text-zinc-300">
			My engagement on the platform was recognized by the ADPList team, and I was awarded as:
		</p>
		<ul class="mb-8 list-inside list-disc text-zinc-300">
			<li><strong>"Top 1% Engineering Mentor"</strong> 4 times</li>
			<li><strong>"Top 10 Architectural Engineering Mentor"</strong></li>
		</ul>

		<h2 class="mt-10 scroll-m-20 pb-1 text-3xl font-semibold tracking-tight text-zinc-100">
			Would like to connect?
		</h2>
		<p class="mb-14 leading-7 text-zinc-300">
			Book a session with me and let's discuss your needs and how I can help you.
		</p>

		<div class="mx-auto mt-12 mb-16 h-[496px] w-full max-w-[650px] overflow-hidden rounded-2xl">
			<iframe
				src="https://adplist.org/widgets/single-session?src=dawid-janiga&session=35227-mentorship-session"
				title="Mentorship Session"
				class="h-full w-full border-0"
				loading="lazy"
			></iframe>
		</div>

		<h2
			class="mt-10 scroll-m-20 pb-1 text-center text-3xl font-semibold tracking-tight text-zinc-100"
		>
			Reviews
		</h2>
		<div class="mx-auto mb-16 h-[1060px] w-full max-w-[650px] overflow-hidden rounded-2xl">
			<iframe
				src="https://adplist.org/widgets/reviews?src=dawid-janiga"
				title="All Reviews"
				class="h-full w-full border-0"
				loading="lazy"
			></iframe>
		</div>

		<h2
			class="mt-10 scroll-m-20 pb-1 text-center text-3xl font-semibold tracking-tight text-zinc-100"
		>
			Impact
		</h2>
		<div class="mx-auto h-[850px] w-full max-w-[650px] overflow-hidden rounded-2xl">
			<iframe
				src="https://adplist.org/widgets/impact?src=dawid-janiga"
				title="Impact"
				class="h-full w-full border-0"
				loading="lazy"
			></iframe>
		</div>
	</article>
</ContentLayout>
