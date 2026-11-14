<script lang="ts">
	let { days, label }: { days?: number; label?: string } = $props();
	let text = $derived(label ?? (days === 1 ? 'Listened in 1 day' : `Listened in ${days} days`));
</script>

<p class="text-sm text-brand-olive/80">{text}</p>
