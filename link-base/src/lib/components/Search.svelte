<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { Search, X } from 'lucide-svelte';

	let {
		searchValue = $bindable(''),
		focusShortcut = false,
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
	<Search class="mx-2 w-4 stroke-neutral-400" />
	<input
		class="grow bg-transparent outline-none placeholder:text-neutral-500"
		type="search"
		autocomplete="off"
		placeholder="Search"
		{...props}
		bind:value={searchValue}
		bind:this={inputElement}
	/>
	{#if searchValue.length !== 0}
		<button
			class="pr-2 opacity-60 outline-none hocus:opacity-100"
			type="button"
			onclick={() => (searchValue = '')}
		>
			<X class="w-4 stroke-neutral-600 dark:stroke-neutral-200" />
		</button>
	{/if}
</div>
