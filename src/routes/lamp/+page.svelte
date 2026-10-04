<script lang="ts">
	import ContentLayout from '$components/ContentLayout.svelte';
	import Header from '$components/Header.svelte';

	const presets = [
		{ name: 'Warm White', color: '#FFB86C' },
		{ name: 'Sunset', color: '#FF7F50' },
		{ name: 'Peach', color: '#FFCBA4' },
		{ name: 'Cool White', color: '#F0F8FF' },
		{ name: 'Arctic', color: '#E0FFFF' },
		{ name: 'Sky', color: '#87CEEB' },
		{ name: 'Lime', color: '#acdb00' },
		{ name: 'Deep Blue', color: '#0078d4' },
		{ name: 'Magenta', color: '#FF00FF' },
		{ name: 'Lavender', color: '#E6E6FA' },
		{ name: 'Mint', color: '#98FF98' },
		{ name: 'Rose', color: '#FFE4E1' }
	];
	let color = $state('#aabbcc');
	let isOn = $state(true);
	let isLoading = $state(false);
	let error = $state('');
	let colorTimeout: ReturnType<typeof setTimeout> | undefined;

	async function send(action: 'turn' | 'color', value: string) {
		isLoading = true;
		error = '';
		try {
			const response = await fetch('/lamp/control', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action, value })
			});
			if (!response.ok) throw new Error(await response.text());
			if (action === 'turn') isOn = value === 'on';
		} catch (cause) {
			error = cause instanceof Error ? cause.message : 'An error occurred';
		} finally {
			isLoading = false;
		}
	}

	function setPreset(value: string) {
		color = value;
		void send('color', value);
	}

	function scheduleColor() {
		clearTimeout(colorTimeout);
		colorTimeout = setTimeout(() => void send('color', color), 250);
	}

	$effect(() => () => clearTimeout(colorTimeout));
</script>

<svelte:head><title>Lamp :: janigowski.dev</title></svelte:head>

<ContentLayout>
	<Header
		title="Background Lamp"
		description="You can control my background lamp here. If you want to see the effect just contact me to have a video call and see the colors flowing."
	/>
	<div class="container mx-auto px-4">
		<div class="mb-32">
			{#if error}
				<div class="mb-8 rounded-lg bg-red-500/10 p-4 text-center text-red-500">
					{error}
					<button type="button" onclick={() => (error = '')} class="ml-2 underline hover:no-underline">
						Dismiss
					</button>
				</div>
			{/if}

			<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
				<section class="rounded-lg bg-brand-purple-dark/5 p-6">
					<h2 class="mb-4 text-lg font-medium text-white">Power</h2>
					<div class="grid grid-cols-2 gap-4">
						<button
							type="button"
							onclick={() => send('turn', 'on')}
							disabled={isLoading || isOn}
							class="rounded-md bg-brand-lime/10 px-4 py-2 text-brand-lime transition-colors hover:bg-brand-lime/20 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{isLoading ? 'Loading...' : 'Turn On'}
						</button>
						<button
							type="button"
							onclick={() => send('turn', 'off')}
							disabled={isLoading || !isOn}
							class="rounded-md bg-brand-olive/10 px-4 py-2 text-brand-olive transition-colors hover:bg-brand-olive/20 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{isLoading ? 'Loading...' : 'Turn Off'}
						</button>
					</div>
				</section>

				<section class="rounded-lg bg-brand-purple-dark/5 p-6">
					<h2 class="mb-4 text-lg font-medium text-white">Presets</h2>
					<div class="grid grid-cols-2 gap-4">
						{#each presets as preset}
							<button
								type="button"
								onclick={() => setPreset(preset.color)}
								disabled={!isOn || isLoading}
								class="rounded-md px-4 py-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
								style:color={preset.color}
								style:background-color={`color-mix(in srgb, ${preset.color} 10%, transparent)`}
							>
								{preset.name}
							</button>
						{/each}
					</div>
				</section>

				<section
					class="rounded-lg bg-brand-purple-dark/5 p-6 transition-opacity"
					class:opacity-50={!isOn}
				>
					<h2 class="mb-4 text-lg font-medium text-white">Custom Color</h2>
					<div class="space-y-4">
						<input
							type="color"
							bind:value={color}
							disabled={!isOn || isLoading}
							oninput={scheduleColor}
							class="h-48 w-full cursor-pointer rounded-md border-0 bg-transparent disabled:pointer-events-none"
							aria-label="Custom lamp color"
						/>
						<div class="flex justify-center">
							<div class="h-12 w-12 rounded-md" style:background-color={color}></div>
						</div>
					</div>
				</section>
			</div>
		</div>
	</div>
</ContentLayout>
