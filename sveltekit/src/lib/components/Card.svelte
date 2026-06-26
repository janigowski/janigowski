<script lang="ts">
	let { children } = $props();
</script>
<div class="rounded-2xl border border-white/10 bg-zinc-900/50 shadow-sm transition hover:bg-zinc-900/80">{@render children()}</div>
