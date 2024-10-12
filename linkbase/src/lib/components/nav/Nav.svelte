<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import ButtonPrimary from '$lib/components/button/ButtonPrimary.svelte';
	import Header from '$lib/components/nav/Header.svelte';
	import Search from '$lib/components/Search.svelte';
	import Select from '$lib/components/Select.svelte';
	import Toggle from '$lib/components/Toggle.svelte';
	import { OrderInnerType, orders, type OrderType, ViewType } from '$lib/types/nav';
	import { ToggleGroup } from 'bits-ui';
	import { GitFork, type Icon, LayoutGrid, List, Plus } from 'lucide-svelte';
	import { type ComponentType } from 'svelte';

	const preferredViewType = getPreffered('preferredViewType', ViewType.list);
	const preferredOrderInnerType = getPreffered('preferredOrderInnerType', OrderInnerType.name);

	let searchValue = $state('');
	let toggleValue = $state(
		browser ? $page.url.searchParams.get('view') || preferredViewType : preferredViewType
	);
	let orderValue: OrderType = $state(
		orders.find((order) => order.value === $page.url.searchParams.get('order')) || orders[0]
	);

	function setSearchParameter(name: string, value: string) {
		$page.url.searchParams.set(name, value);
		goto($page.url, { keepFocus: true, noScroll: true });
	}

	function getPreffered(name: string, fallback: string) {
		return browser ? localStorage.getItem(name) || fallback : fallback;
	}
</script>

<Header />
<div class="mt-4 flex gap-1 px-4 md:gap-4">
	<Search focusShortcut={true} bind:searchValue />
	<Toggle
		onValueChange={(item) => setSearchParameter('view', item || preferredViewType)}
		bind:toggleValue
	>
		{@render toggleItem(ViewType.list, List)}
		{@render toggleItem(ViewType.grid, LayoutGrid)}
		{@render toggleItem(ViewType.canvas, GitFork)}
	</Toggle>
	<Select
		items={orders}
		onSelectedChange={(item) => setSearchParameter('order', item?.value || preferredOrderInnerType)}
		selected={orderValue}
	/>
	<ButtonPrimary>
		<div class="flex min-w-24 flex-row items-center justify-center gap-1">
			New
			<Plus
				class="h-0 w-0 stroke-transparent transition-all group-hover/button:h-4 group-hover/button:w-4 group-hover/button:stroke-inherit group-focus/button:h-4 group-focus/button:w-4 group-focus/button:stroke-inherit"
			/>
		</div>
	</ButtonPrimary>
</div>

{#snippet toggleItem(type: ViewType, Icon: ComponentType<Icon>)}
	<ToggleGroup.Item
		class="rounded p-1 text-neutral-500 transition data-[state=on]:bg-stone-200 data-[state=on]:text-stone-900  hocus:text-stone-900 dark:data-[state=on]:bg-stone-800 dark:data-[state=on]:text-stone-100 dark:hocus:text-stone-100"
		aria-label={`Switch to ${type} view`}
		value={type}
	>
		<Icon class="h-5 w-5"></Icon>
	</ToggleGroup.Item>
{/snippet}
