<script lang="ts">
	let { stats } = $props<{
		stats: {
			total: number;
			read: number;
			reading: number;
			waiting: number;
			mostReadCategory: string;
			completionRate: number;
		};
	}>();

	let section: HTMLElement;
	let isVisible = $state(false);
	let values = $state<number[]>([]);
	let category = $derived.by(() => {
		const match = stats.mostReadCategory.match(/^(.*)\s\((\d+)\)$/);
		return match
			? { label: match[1], value: Number(match[2]) }
			: { label: stats.mostReadCategory, value: undefined };
	});
	let cards = $derived([
		{
			value: stats.total,
			label: 'Total',
			color: 'bg-brand-purple-dark/5',
			textColor: 'text-white',
			labelColor: 'text-white/15'
		},
		{
			value: stats.completionRate,
			suffix: '%',
			label: 'Completion %',
			color: 'bg-brand-purple-dark/5',
			textColor: 'text-white',
			labelColor: 'text-white/15'
		},
		{
			value: category.value,
			prefix: category.value === undefined ? category.label : `${category.label} (`,
			suffix: category.value === undefined ? '' : ')',
			label: 'Top category',
			color: 'bg-brand-purple-dark/5',
			textColor: 'text-white',
			labelColor: 'text-white/15',
			compact: true
		},
		{
			value: stats.read,
			label: 'Read',
			color: 'bg-brand-lime/5',
			textColor: 'text-brand-lime',
			labelColor: 'text-brand-lime/15'
		},
		{
			value: stats.reading,
			label: 'Ongoing',
			color: 'bg-brand-indigo/5',
			textColor: 'text-brand-indigo',
			labelColor: 'text-brand-indigo/60'
		},
		{
			value: stats.waiting,
			label: 'Waiting',
			color: 'bg-brand-olive/5',
			textColor: 'text-brand-olive',
			labelColor: 'text-brand-olive/50'
		}
	]);

	$effect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting || isVisible) return;
				isVisible = true;
				observer.disconnect();
				if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
					values = cards.map((card) => card.value ?? 0);
					return;
				}
				const start = performance.now();
				const animate = (now: number) => {
					let complete = true;
					values = cards.map((card, index) => {
						const progress = Math.min(Math.max((now - start - index * 150) / 1500, 0), 1);
						if (progress < 1) complete = false;
						const eased = 1 - Math.pow(1 - progress, 3);
						return Math.round((card.value ?? 0) * eased);
					});
					if (!complete) requestAnimationFrame(animate);
				};
				requestAnimationFrame(animate);
			},
			{ rootMargin: '0px 0px -50px 0px' }
		);
		observer.observe(section);
		return () => observer.disconnect();
	});
</script>

<section bind:this={section} class="relative mb-32">
	<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
		{#each cards as card, index}
			<div
				class:opacity-100={isVisible}
				class:opacity-0={!isVisible}
				class="relative flex h-40 flex-col justify-between rounded-2xl p-8 transition-opacity duration-700 {card.color}"
				style:transition-delay={`${index * 150}ms`}
			>
				<div class="flex flex-1 items-start">
					<span
						class="line-clamp-2 font-medium {card.compact ? 'text-3xl' : 'text-6xl'} {card.textColor}"
					>
						{card.prefix ?? ''}{card.value === undefined ? '' : (values[index] ?? 0)}{card.suffix ??
							''}
					</span>
				</div>
				<div>
					<span class="text-base font-medium {card.labelColor}">{card.label}</span>
				</div>
			</div>
		{/each}
	</div>
</section>
