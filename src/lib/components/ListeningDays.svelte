<script lang="ts">
	let { days }: { days: number } = $props();
	let label = $derived(days === 1 ? 'Listened in 1 day' : `Listened in ${days} days`);
</script>

<p class="text-sm text-brand-olive/80">{label}</p>
