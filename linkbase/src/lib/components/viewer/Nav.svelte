<script lang="ts">
	import ButtonPrimary from '$lib/components/common/ButtonPrimary.svelte';
	import ButtonSecondary from '$lib/components/common/ButtonSecondary.svelte';
	import Dialog from '$lib/components/common/Dialog.svelte';
	import Search from '$lib/components/common/Search.svelte';
	import Select from '$lib/components/common/Select.svelte';
	import ToggleGroup from '$lib/components/common/ToggleGroup.svelte';
	import { orders, type OrderType, ViewType } from '$lib/types/viewer';
	import { ToggleGroup as Toggle } from 'bits-ui';
	import { type Selected } from 'bits-ui';
	import {
		ArrowRight,
		Clipboard,
		File,
		GitFork,
		type Icon,
		LayoutGrid,
		Link,
		List,
		Plus
	} from 'lucide-svelte';
	import { type ComponentType } from 'svelte';

	let {
		searchValue = $bindable(),
		viewValue = $bindable(),
		orderValue = $bindable(),
		isLoading = $bindable(false),
		onViewChange = () => {},
		onOrderChange = () => {}
	}: {
		searchValue: string;
		viewValue: string;
		orderValue: OrderType;
		isLoading?: boolean;
		onViewChange?: (value: string | undefined) => void;
		onOrderChange?: (value: Selected<string> | undefined) => void;
	} = $props();

	let dialogNewOpen = $state(false);
	let dialogInputElement: HTMLInputElement;

	let focusShortcut = $derived(!dialogNewOpen);
</script>

<div class="relative mt-4 flex gap-0.5 sm:gap-2">
	<Search {focusShortcut} focusShortcutShown={true} bind:searchValue bind:isLoading />
	<ToggleGroup onValueChange={onViewChange} bind:toggleValue={viewValue}>
		{@render toggleItem(ViewType.list, List)}
		{@render toggleItem(ViewType.grid, LayoutGrid)}
		{@render toggleItem(ViewType.canvas, GitFork)}
	</ToggleGroup>
	<Select
		items={orders}
		onSelectedChange={onOrderChange}
		preventScroll={false}
		bind:selected={orderValue}
	/>
	<div class="bottom-0 right-0 z-10 max-md:fixed max-md:mb-6 max-md:mr-6 max-md:h-6 max-md:w-6">
		<ButtonPrimary onclick={() => (dialogNewOpen = true)}>
			<div class="flex flex-row items-center justify-center gap-1 md:min-w-24">
				<span class="hidden md:flex">New</span>
				<Plus
					class="h-4 w-4 transition-all group-hover/button:h-4 group-hover/button:w-4 group-hover/button:stroke-inherit group-focus/button:h-4 group-focus/button:w-4 group-focus/button:stroke-inherit md:h-0 md:w-0 md:stroke-transparent"
				/>
			</div>
		</ButtonPrimary>
	</div>
</div>

{#snippet toggleItem(type: ViewType, Icon: ComponentType<Icon>)}
	<Toggle.Item
		class="rounded p-1 text-neutral-500 transition data-[state=on]:bg-stone-200 data-[state=on]:text-stone-900 hocus:text-stone-900 dark:data-[state=on]:bg-stone-800 dark:data-[state=on]:text-stone-100 dark:hocus:text-stone-100"
		aria-label={`Switch to ${type} view`}
		value={type}
	>
		<Icon class="h-4 w-4 sm:h-5 sm:w-5"></Icon>
	</Toggle.Item>
{/snippet}

<Dialog {buttons} {description} title="New link" bind:alertOpen={dialogNewOpen}></Dialog>
{#snippet description()}
	<div class="flex flex-col gap-8">
		<div
			class="flex h-36 w-full cursor-pointer flex-col items-center justify-center gap-4 rounded bg-stone-300 bg-opacity-20 p-4 text-stone-600 hocus:bg-opacity-40 hocus:text-stone-900 motion-safe:transition dark:bg-stone-700 dark:bg-opacity-30 dark:text-stone-400 dark:hocus:text-stone-100"
		>
			<File class="size-8" />
			<div class="flex flex-col items-center justify-center text-center">
				<span class="text-sm font-semibold">Drop a file or click here to browse</span>
				<span class="text-xs tracking-tight text-stone-500">Extract links from the file</span>
			</div>
		</div>
		<form
			class="flex h-10 grow items-center rounded border border-neutral-500 border-opacity-40 transition *:h-full invalid:border-red-200 focus-within:border-opacity-100"
		>
			<Link
				class="mx-2 h-4 min-h-4 w-4 min-w-4 cursor-pointer stroke-neutral-500"
				onclick={() => dialogInputElement.focus({ preventScroll: true })}
			/>
			<input
				bind:this={dialogInputElement}
				class="flex w-full min-w-0 place-items-center bg-transparent !outline-0 placeholder:text-sm placeholder:font-medium placeholder:text-neutral-500 md:placeholder:text-base"
				pattern="\S*\S\.\S\S*"
				placeholder="example.com"
				title="Enter a valid domain"
				type="text"
			/>
			<ButtonSecondary
				class="group/button flex min-h-6 min-w-6 flex-row items-center justify-center gap-2 rounded-r bg-stone-400 bg-opacity-0 stroke-slate-700 p-2 text-sm text-stone-800 transition hocus:bg-opacity-15 dark:bg-stone-300 dark:bg-opacity-0 dark:stroke-slate-100 dark:text-slate-100"
				type="submit"
			>
				<ArrowRight
					class="size-4 text-stone-500 transition group-hover/button:text-stone-800 group-focus/button:text-stone-800 dark:group-hover/button:text-stone-200 dark:group-focus/button:text-stone-200"
				/>
			</ButtonSecondary>
		</form>
	</div>
{/snippet}

{#snippet buttons()}
	<div class="gap-between flex w-full items-center justify-between">
		<ButtonSecondary content="Get from clipboard" icon={Clipboard}></ButtonSecondary>
	</div>
{/snippet}
