<script lang="ts">
	import ButtonPrimary from '$lib/components/common/ButtonPrimary.svelte';
	import Search from '$lib/components/common/Search.svelte';
	import Select from '$lib/components/common/Select.svelte';
	import ToggleGroup from '$lib/components/common/ToggleGroup.svelte';
	import ToggleGroupItem from '$lib/components/common/ToggleGroupItem.svelte';
	import { orders, type OrderType, ViewType } from '$lib/types/viewer';
	import { type Selected } from 'bits-ui';
	import { GitFork, LayoutGrid, List, Plus } from 'lucide-svelte';

	let {
		searchValue = $bindable(),
		viewValue = $bindable(),
		orderValue = $bindable(),
		isLoading = $bindable(false),
		dialogNewOpen = $bindable(false),
		onViewChange = () => {},
		onOrderChange = () => {}
	}: {
		searchValue: string;
		viewValue: string;
		orderValue: OrderType;
		isLoading?: boolean;
		dialogNewOpen?: boolean;
		onViewChange?: (value: string | undefined) => void;
		onOrderChange?: (value: Selected<string> | undefined) => void;
	} = $props();

	let focusShortcut = $derived(!dialogNewOpen);
</script>

<div class="relative mt-4 flex gap-0.5 sm:gap-2">
	<Search {focusShortcut} focusShortcutShown={true} bind:searchValue bind:isLoading />
	<ToggleGroup onValueChange={onViewChange} bind:toggleValue={viewValue}>
		<ToggleGroupItem Icon={List} type={ViewType.list} />
		<ToggleGroupItem Icon={LayoutGrid} type={ViewType.grid} />
		<ToggleGroupItem Icon={GitFork} type={ViewType.canvas} />
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
