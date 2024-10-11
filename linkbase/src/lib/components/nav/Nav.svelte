<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import ButtonPrimary from '$lib/components/button/ButtonPrimary.svelte';
	import Header from '$lib/components/nav/Header.svelte';
	import Search from '$lib/components/Search.svelte';
	import Toggle from '$lib/components/Toggle.svelte';
	import { ViewType } from '$lib/types/view';
	import { ToggleGroup } from 'bits-ui';
	import { Plus } from 'lucide-svelte';
	import { GitFork, type Icon, LayoutGrid, List } from 'lucide-svelte';
	import { type ComponentType } from 'svelte';

	const preferredViewType = browser
		? localStorage.getItem('preferredViewType') || ViewType.list
		: ViewType.list;

	let searchValue = $state('');
	let toggleValue = $state($page.url.searchParams.get('view') || preferredViewType);

	function switchViewType(viewType: string | ViewType) {
		if (typeof viewType === 'string') viewType = ViewType[viewType as keyof typeof ViewType];

		$page.url.searchParams.set('view', viewType.toString());
		goto($page.url);
	}
</script>

<Header />
<div class="mt-4 flex gap-1 px-4 md:gap-4">
	<Search focusShortcut={true} bind:searchValue />
	<Toggle onValueChange={(item) => switchViewType(item || preferredViewType)} bind:toggleValue>
		{@render toggleItem(ViewType.list, List)}
		{@render toggleItem(ViewType.grid, LayoutGrid)}
		{@render toggleItem(ViewType.canvas, GitFork)}
	</Toggle>
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
		aria-label={`toggle ${type.toString()} view`}
		value={type}
	>
		<Icon class="h-5 w-5"></Icon>
	</ToggleGroup.Item>
{/snippet}
