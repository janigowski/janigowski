<script lang="ts">
	import { onMount } from 'svelte';
	let canvas: HTMLCanvasElement;
	onMount(() => {
		const context = canvas.getContext('2d');
		if (!context) return;
		const ctx = context;
		let frame = 0;
		const particles = Array.from({ length: 40 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 2 + 1, v: Math.random() * 0.0008 + 0.0002 }));
		function resize() { canvas.width = innerWidth; canvas.height = innerHeight; }
		function draw() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = 'rgba(187, 223, 50, 0.25)';
			for (const particle of particles) {
				particle.y = (particle.y + particle.v) % 1;
				ctx.beginPath();
				ctx.arc(particle.x * canvas.width, particle.y * canvas.height, particle.r, 0, Math.PI * 2);
				ctx.fill();
			}
			frame = requestAnimationFrame(draw);
		}
		resize();
		addEventListener('resize', resize);
		draw();
		return () => { cancelAnimationFrame(frame); removeEventListener('resize', resize); };
	});
</script>
<canvas bind:this={canvas} class="pointer-events-none fixed inset-0 -z-10 opacity-40 print:hidden"></canvas>
