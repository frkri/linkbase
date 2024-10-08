<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	import { Search, X } from 'lucide-svelte';

	let {
		focusShortcut = false,
		searchValue = $bindable(''),
		...props
	}: {
		focusShortcut?: boolean;
		searchValue: string;
	} & HTMLInputAttributes = $props();

	let inputElement: HTMLInputElement;
</script>

<svelte:window
	onkeydown={(e) => {
		if (!focusShortcut) return;
		if (e.key === '/' || (e.ctrlKey && e.key === 'k')) {
			e.preventDefault();
			inputElement.focus();
		}
	}}
/>

<div
	class="flex h-10 items-center rounded border border-neutral-500 border-opacity-40 transition *:h-full focus-within:border-opacity-100"
>
	<Search class="mx-2 h-4 min-h-4 w-4 min-w-4 stroke-neutral-500" />
	<input
		autocomplete="off"
		class="min-w-0 grow bg-transparent outline-none placeholder:font-medium placeholder:text-neutral-500"
		placeholder="Search"
		spellcheck="false"
		type="search"
		{...props}
		bind:this={inputElement}
		bind:value={searchValue}
	/>
	{#if searchValue.length !== 0}
		<button
			class="pr-2 opacity-60 outline-none hocus:opacity-100"
			onclick={() => (searchValue = '')}
			type="button"
		>
			<X class="mx-1 w-4 stroke-neutral-600 dark:stroke-neutral-200" />
		</button>
	{:else if focusShortcut}
		<span class="mx-1 hidden max-h-6 flex-row gap-1 sm:flex">
			{#each ['CTRL', 'K'] as key}
				<kbd
					class="flex items-center justify-center rounded bg-stone-300 p-2 font-mono text-xs font-semibold dark:bg-stone-800"
				>
					{key}
				</kbd>
			{/each}
		</span>
	{/if}
</div>
