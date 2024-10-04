<script lang="ts">
	import Favicon from '$lib/assets/Favicon.svelte';
	import { fade } from 'svelte/transition';

	import Avatar from './Avatar.svelte';

	let isPinned = $state(false);
	let divElement: HTMLElement;
	$effect(() => {
		let scrollObserver = new IntersectionObserver(([e]) => (isPinned = e.intersectionRatio < 1), {
			threshold: [1]
		});
		scrollObserver.observe(divElement);

		return () => scrollObserver.disconnect();
	});
</script>

<div bind:this={divElement} class="pointer-events-none sticky top-[-1px] h-28">
	<nav
		class="pointer-events-auto mt-2 flex h-28 w-full flex-row items-center justify-between rounded p-2 backdrop-blur-sm"
		class:max-h-16={isPinned}
	>
		<button
			class="flex flex-row place-items-center gap-8 justify-self-center rounded-lg bg-stone-500 bg-opacity-0 px-2 py-2 text-6xl font-bold transition hocus:bg-opacity-40"
			onclick={() => scrollTo({ behavior: 'smooth', top: 0 })}
		>
			<Favicon height={!isPinned ? 60 : 40} width={!isPinned ? 60 : 40} />
			{#if !isPinned}
				<span in:fade={{ duration: 200 }}>linkbase</span>
			{/if}
		</button>
		<Avatar />
	</nav>
</div>
