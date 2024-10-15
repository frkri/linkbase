<script lang="ts">
	import ButtonPrimary from '$lib/components/common/ButtonPrimary.svelte';
	import Search from '$lib/components/common/Search.svelte';
	import Select from '$lib/components/common/Select.svelte';
	import ToggleGroup from '$lib/components/common/ToggleGroup.svelte';
	import { orders, type OrderType, ViewType } from '$lib/types/viewer';
	import { ToggleGroup as Toggle } from 'bits-ui';
	import { type Selected } from 'bits-ui';
	import { GitFork, type Icon, LayoutGrid, List, Plus } from 'lucide-svelte';
	import { type ComponentType } from 'svelte';

	let {
		searchValue = $bindable(),
		viewValue = $bindable(),
		orderValue = $bindable(),
		onViewChange = () => {},
		onOrderChange = () => {}
	}: {
		searchValue: string;
		viewValue: string;
		orderValue: OrderType;
		onViewChange?: (value: string | undefined) => void;
		onOrderChange?: (value: Selected<string> | undefined) => void;
	} = $props();
</script>

<div class="relative mt-4 flex gap-0.5 px-2 sm:gap-2">
	<Search focusShortcut={true} bind:searchValue />
	<ToggleGroup onValueChange={onViewChange} bind:toggleValue={viewValue}>
		{@render toggleItem(ViewType.list, List)}
		{@render toggleItem(ViewType.grid, LayoutGrid)}
		{@render toggleItem(ViewType.canvas, GitFork)}
	</ToggleGroup>
	<Select items={orders} onSelectedChange={onOrderChange} bind:selected={orderValue} />
	<div class="bottom-0 right-0 z-10 max-md:fixed max-md:mb-6 max-md:mr-6 max-md:h-6 max-md:w-6">
		<ButtonPrimary>
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
		class="rounded p-1 text-neutral-500 transition data-[state=on]:bg-stone-200 data-[state=on]:text-stone-900  hocus:text-stone-900 dark:data-[state=on]:bg-stone-800 dark:data-[state=on]:text-stone-100 dark:hocus:text-stone-100"
		aria-label={`Switch to ${type} view`}
		value={type}
	>
		<Icon class="h-4 w-4 sm:h-5 sm:w-5"></Icon>
	</Toggle.Item>
{/snippet}
