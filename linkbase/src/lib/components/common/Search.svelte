<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	import { Loader, Search, X } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	let {
		focusShortcut = false,
		focusShortcutShown = false,
		searchValue = $bindable(''),
		isLoading = $bindable(false),
		...props
	}: {
		focusShortcut?: boolean;
		focusShortcutShown?: boolean;
		searchValue: string;
		isLoading?: boolean;
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
	class="relative flex h-10 grow items-center rounded border border-neutral-500 border-opacity-40 bg-stone-100 transition *:h-full focus-within:border-opacity-100 max-sm:focus-within:absolute max-sm:focus-within:w-[calc(100%-1rem)] dark:bg-stone-900"
>
	<div class="absolute ml-2 flex place-items-center">
		{#if isLoading}
			<div class="motion-safe:animate-spin" in:fade={{ delay: 250, duration: 200 }}>
				<Loader
					class="h-4 min-h-4 w-4 min-w-4 cursor-pointer stroke-neutral-500"
					onclick={() => inputElement.focus({ preventScroll: true })}
				/>
			</div>
		{:else}
			<div out:fade={{ delay: 0, duration: 200 }}>
				<Search
					class="h-4 min-h-4 w-4 min-w-4 cursor-pointer stroke-neutral-500"
					onclick={() => inputElement.focus({ preventScroll: true })}
				/>
			</div>
		{/if}
	</div>
	<input
		bind:this={inputElement}
		class="ml-8 flex w-0 min-w-0 grow place-items-center bg-transparent !outline-0 placeholder:text-sm placeholder:font-medium placeholder:text-neutral-500 md:placeholder:text-base"
		autocomplete="off"
		placeholder="Search"
		spellcheck="false"
		type="search"
		{...props}
		bind:value={searchValue}
	/>
	{#if searchValue.length !== 0}
		<button
			class="pr-2 opacity-60 hocus:opacity-100"
			onclick={() => (searchValue = '')}
			type="button"
		>
			<X class="mx-1 w-4 stroke-neutral-600 dark:stroke-neutral-200" />
		</button>
	{:else if focusShortcutShown}
		<span class="mx-1 hidden max-h-6 flex-row gap-1 sm:flex">
			{#each ['CTRL', 'K'] as key}
				<kbd
					class="flex items-center justify-center rounded bg-stone-300 p-2 font-mono text-xs font-bold dark:bg-stone-800"
				>
					{key}
				</kbd>
			{/each}
		</span>
	{/if}
</div>
