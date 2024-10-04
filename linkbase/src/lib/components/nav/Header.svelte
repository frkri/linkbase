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

<div bind:this={divElement} class="pointer-events-none sticky top-[-1px] h-28 pt-2">
	<nav
		class="pointer-events-auto flex h-12 w-full flex-row items-center justify-between rounded border border-slate-500 border-opacity-0 bg-stone-100 bg-opacity-40 px-2 backdrop-blur-sm dark:bg-stone-900 dark:bg-opacity-40"
		class:!bg-opacity-0={!isPinned}
		class:!border-opacity-30={isPinned}
		class:min-h-28={!isPinned}
	>
		<button
			class="flex flex-row place-items-center gap-4 justify-self-center rounded-lg bg-stone-500 bg-opacity-0 p-1 font-bold transition hocus:bg-opacity-40 md:gap-8"
			onclick={() => scrollTo({ behavior: 'smooth', top: 0 })}
		>
			<Favicon
				class="max-h-[45px] max-w-[45px] md:max-h-[60px] md:max-w-[60px]"
				height={isPinned ? 30 : 60}
				width={isPinned ? 30 : 60}
			/>
			{#if !isPinned}
				<span class="text-4xl md:text-6xl" in:fade={{ duration: 200 }}>linkbase</span>
			{/if}
		</button>
		<Avatar />
	</nav>
</div>
