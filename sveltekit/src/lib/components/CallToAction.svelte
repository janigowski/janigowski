<script lang="ts">
	let { href, children } = $props<{ href: string; children: any }>();
</script>
<a class="inline-flex rounded-full bg-brand-lime px-5 py-3 font-medium text-black hover:bg-white" {href}>{@render children()}</a>
