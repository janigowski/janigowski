<script lang="ts">
	let { text, title = 'Prompt' }: { text: string; title?: string } = $props();

	let copied = $state(false);
	let resetTimer: ReturnType<typeof setTimeout> | undefined;

	async function copy() {
		const value = text.replace(/\n$/, '');
		try {
			await navigator.clipboard.writeText(value);
		} catch {
			const area = document.createElement('textarea');
			area.value = value;
			area.setAttribute('readonly', '');
			area.style.position = 'fixed';
			area.style.left = '-9999px';
			document.body.append(area);
			area.select();
			document.execCommand('copy');
			area.remove();
		}
		copied = true;
		clearTimeout(resetTimer);
		resetTimer = setTimeout(() => {
			copied = false;
		}, 2000);
	}
</script>

<div class="not-prose my-6 overflow-hidden rounded-xl border border-zinc-700 bg-zinc-950">
	<div class="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 px-3 py-2 sm:px-4">
		<p class="text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">{title}</p>
		<button
			type="button"
			class="min-h-11 rounded-md px-3 text-sm font-medium text-brand-lime focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-lime"
			aria-label={copied ? 'Copied' : `Copy ${title.toLowerCase()}`}
			onclick={copy}
		>
			{copied ? 'Copied' : 'Copy'}
		</button>
	</div>
	<pre
		class="overflow-x-auto px-3 py-3 font-mono text-[0.8rem] leading-relaxed whitespace-pre-wrap break-words text-zinc-200 sm:px-4 sm:text-sm">{text}</pre>
	<span class="sr-only" aria-live="polite">{copied ? 'Copied' : ''}</span>
</div>

<style>
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: -1px;
		padding: 0;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
</style>
