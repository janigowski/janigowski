<script lang="ts">
	import { onMount } from 'svelte';
	let container: HTMLDivElement;
	onMount(() => {
		const script = document.createElement('script');
		script.src = 'https://giscus.app/client.js';
		script.async = true;
		script.crossOrigin = 'anonymous';
		script.setAttribute('data-repo', 'janigowski/janigowski');
		script.setAttribute('data-repo-id', 'R_kgDOMOfovQ');
		script.setAttribute('data-category', 'Announcements');
		script.setAttribute('data-category-id', 'DIC_kwDOMOfovc4Cl4cb');
		script.setAttribute('data-mapping', 'pathname');
		script.setAttribute('data-strict', '0');
		script.setAttribute('data-reactions-enabled', '1');
		script.setAttribute('data-emit-metadata', '0');
		script.setAttribute('data-input-position', 'bottom');
		script.setAttribute('data-theme', '/api/giscus-theme');
		script.setAttribute('data-lang', 'en');
		script.setAttribute('data-loading', 'lazy');
		container.appendChild(script);
	});
</script>
<div class="mt-16" bind:this={container}></div>
