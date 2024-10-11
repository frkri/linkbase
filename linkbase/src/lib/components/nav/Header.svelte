<script lang="ts">
	import Favicon from '$lib/assets/Favicon.svelte';
	import { fade } from 'svelte/transition';

	import Avatar from './Avatar.svelte';

	let isPinned = $state(false);
	let divElement: HTMLElement;

	$effect(() => {
		let scrollObserver = new IntersectionObserver(([e]) => (isPinned = e.intersectionRatio < 1), {
			threshold: 1
		});
		scrollObserver.observe(divElement);

		return () => scrollObserver.disconnect();
	});
</script>

<div bind:this={divElement} class="pointer-events-none sticky top-[-1px] z-20 h-28 pt-2">
	<nav
		class="pointer-events-auto flex h-12 w-full flex-row items-center justify-between rounded bg-stone-100 bg-opacity-40 px-2 backdrop-blur-sm dark:bg-stone-900 dark:bg-opacity-40"
		class:!bg-opacity-0={!isPinned}
		class:!border-opacity-30={isPinned}
		class:drop-shadow-xl={isPinned}
		class:min-h-28={!isPinned}
	>
		<button
			class="flex flex-row place-items-center gap-4 justify-self-center rounded-lg bg-stone-500 bg-opacity-0 p-1 font-bold transition hocus:bg-opacity-20 md:gap-8"
			onclick={() => scrollTo({ behavior: 'smooth', top: 0 })}
		>
			<Favicon
				class="max-h-[30px] max-w-[30px] md:max-h-[50px] md:max-w-[50px]"
				height={isPinned ? 30 : 50}
				width={isPinned ? 30 : 50}
			/>
			{#if !isPinned}
				<span class="text-2xl md:text-4xl" in:fade={{ duration: 200 }}>linkbase</span>
			{/if}
		</button>
		<Avatar />
	</nav>
</div>
