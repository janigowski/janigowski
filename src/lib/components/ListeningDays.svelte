<script lang="ts">
	let { days }: { days: number } = $props();
	let label = $derived(days === 1 ? 'Listened in 1 day' : `Listened in ${days} days`);
</script>

<p class="text-sm font-medium text-brand-lime tabular-nums">{label}</p>
