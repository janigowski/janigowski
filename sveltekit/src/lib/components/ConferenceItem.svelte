<script lang="ts">
	let { date, place, conference, children } = $props<{ date: string; place: string; conference: string; children: any }>();
</script>
<div class="grid gap-2 py-5 md:grid-cols-[120px_1fr]"><div class="text-sm text-zinc-500">{date}</div><div><h3 class="font-semibold text-zinc-100">{@render children()}</h3><p class="text-sm text-zinc-400">{conference} · {place}</p></div></div>
