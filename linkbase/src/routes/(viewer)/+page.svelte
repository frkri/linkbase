<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import ListItem from '$lib/components/viewer/items/list/ListItem.svelte';
	import Nav from '$lib/components/viewer/Nav.svelte';
	import { getPrefferedFromMultiple, setParameter } from '$lib/modules/common';
	import {
		CancelReason,
		ItemStorageKeys,
		ItemURLParams,
		OrderInnerType,
		orders,
		ViewType
	} from '$lib/types/viewer';
	import { fade } from 'svelte/transition';

	const preferredViewType = getPrefferedFromMultiple(
		$page.url,
		ItemURLParams.view,
		ItemStorageKeys.view,
		ViewType.list
	);
	const preferredOrderType =
		orders.find(
			(order) =>
				order.value ===
				getPrefferedFromMultiple(
					$page.url,
					ItemURLParams.order,
					ItemStorageKeys.order,
					OrderInnerType.title
				)
		) || orders[0];

	const { data } = $props();

	let viewValue = $state(preferredViewType);
	let orderValue = $state(preferredOrderType);
	let searchValue = $state($page.url.searchParams.get(ItemURLParams.query)?.trimEnd() || '');

	const searchParams = $page.url.searchParams;
	$effect(() => {
		setParameter(searchParams, ItemURLParams.view, viewValue);
		setParameter(searchParams, ItemURLParams.order, orderValue.value);
		setParameter(searchParams, ItemURLParams.query, searchValue);

		debounceGoto();
	});

	let isLoading = $state(true);
	$effect(() => {
		isLoading = true;
		data.items.then(
			() => (isLoading = false),
			(reason) => {
				if (reason !== CancelReason.aborted) isLoading = false;
			}
		);
	});

	let timeoutId: number;
	function debounceGoto() {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			goto(`?${searchParams.toString()}`, { keepFocus: true, noScroll: true, replaceState: true });
		}, 200);
	}
</script>

<Nav bind:searchValue bind:viewValue bind:orderValue bind:isLoading />
{#await data.items}
	<ul
		class="mt-4 flex max-h-[calc(100svh-14rem)] flex-col gap-4 overflow-hidden"
		in:fade={{ delay: 200, duration: 200 }}
	>
		<!-- eslint-disable @typescript-eslint/no-unused-vars -->
		{#each { length: 15 } as _}
			<div
				class="min-h-16 w-full animate-pulse rounded bg-stone-400 bg-opacity-20 md:min-h-24 dark:bg-stone-600 dark:bg-opacity-20"
			></div>
		{/each}
	</ul>
{:then items}
	{#if items.length === 0}
		<div class="mt-16 grid place-items-center gap-2">
			<h2 class="font-semibold">No Links Found</h2>
			<p class="text-center text-stone-500">
				{#if searchValue.length === 0}
					Get started by adding a new link
				{:else}
					There were no results found for the search query you entered
				{/if}
			</p>
		</div>
	{:else}
		<ul class="mt-4 flex flex-col gap-4">
			{#each items as item (item.id)}
				<ListItem {...item} />
			{/each}
		</ul>
	{/if}
{:catch error}
	<div class="mt-16 grid place-items-center gap-2">
		<h2 class="font-semibold">An Error Occurred</h2>
		<p class="text-center text-stone-500">{error}</p>
	</div>
{/await}
