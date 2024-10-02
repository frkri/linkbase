<script lang="ts">
	import Favicon from '$lib/assets/Favicon.svelte';
	import { fade } from 'svelte/transition';

	let hasScrolledPast = $state(false);
	$effect(() => {
		let topPixel = document.getElementById('top-pixel');
		if (!topPixel) return;

		let scrollObserver = new IntersectionObserver((entries) => {
			hasScrolledPast = !entries[0].isIntersecting;
		});
		scrollObserver.observe(topPixel);
		// todo fix
	});
</script>

<div class="absolute bottom-0 hidden" id="top-pixel"></div>
<div
	class="sticky top-0 mx-auto flex h-28 w-full flex-row items-center justify-center rounded bg-opacity-20 backdrop-blur-sm backdrop-opacity-95"
	class:h-12={hasScrolledPast}
>
	<button
		class="flex flex-row place-items-center gap-8 rounded-lg bg-stone-500 bg-opacity-0 px-4 py-2 text-6xl font-bold transition hocus:bg-opacity-30"
		onclick={() => scrollTo({ top: 0, behavior: 'smooth' })}
	>
		<Favicon class="max-h-16 max-w-16" />
		{#if !hasScrolledPast}
			<span transition:fade>linkbase</span>
		{/if}
	</button>
</div>
