<script lang="ts">
	let { stats } = $props<{ stats: { total: number; read: number; reading: number; waiting: number; mostReadCategory: string; completionRate: number } }>();
	let items = $derived([['Total', stats.total], ['Completed', stats.read], ['Reading', stats.reading], ['Waiting', stats.waiting], ['Completion', `${stats.completionRate}%`], ['Top category', stats.mostReadCategory]]);
</script>
<section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{#each items as [label, value]}<div class="rounded-xl border border-white/10 bg-zinc-900/50 p-4"><div class="text-sm text-zinc-500">{label}</div><div class="mt-2 text-2xl font-semibold text-zinc-100">{value}</div></div>{/each}</section>
