<script lang="ts">
	import AnimatedTitle from './AnimatedTitle.svelte';

	let { title, description, centered = false, descriptionClass = '' } = $props<{
		title: string;
		description?: string;
		centered?: boolean;
		descriptionClass?: string;
	}>();
</script>

{#if centered}
	<header class="relative isolate overflow-hidden">
		<div class="container relative isolate mx-auto overflow-hidden py-24 sm:py-32">
			<div class="mx-auto flex max-w-7xl flex-col items-center px-6 text-center lg:px-8">
				<div class="mx-auto max-w-2xl lg:mx-0">
					<AnimatedTitle text={title} />
					{#if description}
						<p class="description-enter mt-6 text-lg leading-8 text-zinc-400 {descriptionClass}">
							{description}
						</p>
					{/if}
				</div>
			</div>
		</div>
	</header>
{:else}
	<div>
		<AnimatedTitle text={title} />
		{#if description}
			<div class="description-enter text-zinc-400 {descriptionClass || 'mt-10'}">{description}</div>
		{/if}
	</div>
	<div class="mt-10 h-px w-full bg-zinc-700"></div>
{/if}

<style>
	.description-enter {
		animation: fade-up 0.4s ease-in-out both;
	}

	.description-enter {
		animation-delay: 0.15s;
	}

	@keyframes fade-up {
		from {
			opacity: 0;
			transform: translateY(5px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.description-enter {
			animation: none;
		}
	}
</style>
