<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import ButtonPrimary from '$lib/components/common/ButtonPrimary.svelte';
	import ButtonSecondary from '$lib/components/common/ButtonSecondary.svelte';
	import Dialog from '$lib/components/common/Dialog.svelte';
	import ListItem from '$lib/components/viewer/items/list/ListItem.svelte';
	import Nav from '$lib/components/viewer/Nav.svelte';
	import {
		getPrefferedFromMultiple,
		requestAuthorization,
		setParameter
	} from '$lib/modules/common';
	import { FetchError, scrape } from '$lib/modules/scraper/scraper';
	import { db } from '$lib/modules/storage/db/client';
	import {
		CancelReason,
		ItemStorageKeys,
		ItemURLParams,
		OrderInnerType,
		orders,
		ViewType
	} from '$lib/types/viewer';
	import { Checkbox } from 'bits-ui';
	import { ArrowRight, Check, Clipboard, File, Link } from 'lucide-svelte';
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

	let dialogNewOpen = $state(false);
	let dialogInputElement: HTMLInputElement;

	let dialogConfirmOpen = $state(false);
	let dialogLinks: string[] = $state([]);
	let dialogCheckedLinks: string[] = $state([]);

	async function extractLinksFromFiles(files: FileList) {
		let collectedUrls: string[] = [];
		for (const file of files) {
			if (!file) continue;

			const text = await file.text();
			const urls = text.match(/https?:\/\/[^\s]+/g);
			if (urls) collectedUrls = [...collectedUrls, ...urls];
		}

		return collectedUrls;
	}

	async function newLink(value: string) {
		if (!value.startsWith('http')) value = `https://${value}`;
		const url = new URL(value);

		let scrapedData;
		try {
			scrapedData = await scrape(url);
		} catch (error) {
			console.warn(error);
			if (error === FetchError.Unauthorized) requestAuthorization();
		}
		if (!scrapedData) return;

		await db
			.insertInto('links')
			.values({
				title: scrapedData.title || url.hostname,
				description: scrapedData.description || '',
				url: url.toString(),
				imgAlt: scrapedData.imgAlt,
				imgSrc: (await scrapedData.imgSrc?.arrayBuffer()) || null,
				imgType: scrapedData.imgSrc?.type || 'image/png',
				viewedAt: new Date().getTime(),
				createdAt: new Date().getTime(),
				views: 0
			})
			.execute();
		invalidate('load:query');
	}
</script>

<Nav bind:searchValue bind:viewValue bind:orderValue bind:isLoading bind:dialogNewOpen />
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

<Dialog
	buttons={dialogNewButtons}
	description={dialogNewDescription}
	title="New link"
	bind:alertOpen={dialogNewOpen}
/>
{#snippet dialogNewDescription()}
	<div class="flex flex-col gap-8">
		<button
			class="flex h-36 w-full cursor-pointer flex-col items-center justify-center gap-4 rounded bg-stone-300 bg-opacity-20 p-4 text-stone-700 hocus:bg-opacity-40 hocus:text-stone-900 motion-safe:transition dark:bg-stone-700 dark:bg-opacity-30 dark:text-stone-300 dark:hocus:text-stone-100"
			aria-label="dropzone"
			onclick={async () => {
				const input = document.createElement('input');
				input.type = 'file';
				input.multiple = true;
				input.onchange = async () => {
					input.remove();
					if (!input.files) return;

					dialogCheckedLinks = [];
					dialogLinks = (await extractLinksFromFiles(input.files)) || [];
					dialogNewOpen = false;
					dialogConfirmOpen = true;
				};
				input.click();
			}}
			ondragover={(e) => e.preventDefault()}
			ondrop={async (e) => {
				e.preventDefault();
				if (!e.dataTransfer) return;

				dialogCheckedLinks = [];
				dialogLinks = (await extractLinksFromFiles(e.dataTransfer.files)) || [];
				dialogNewOpen = false;
				dialogConfirmOpen = true;
			}}
			tabindex="0"
		>
			<File class="size-8" />
			<div class="flex flex-col items-center justify-center text-center">
				<span class="text-sm font-semibold">Drop a file or click here to browse</span>
				<span class="text-xs tracking-tight text-stone-500">Extract links from the file</span>
			</div>
		</button>
		<form
			class="flex h-10 grow items-center rounded border border-neutral-500 border-opacity-40 transition *:h-full invalid:border-red-200 focus-within:border-opacity-100"
			onsubmit={async (e) => {
				e.preventDefault();
				newLink(dialogInputElement.value);
				dialogInputElement.value = '';
				dialogNewOpen = false;
			}}
		>
			<Link
				class="mx-2 h-4 min-h-4 w-4 min-w-4 cursor-pointer stroke-neutral-500"
				onclick={() => dialogInputElement.focus({ preventScroll: true })}
			/>
			<input
				bind:this={dialogInputElement}
				class="w-full min-w-0 bg-transparent !outline-0 placeholder:text-sm placeholder:font-medium placeholder:text-neutral-500 md:placeholder:text-base"
				autocomplete="off"
				pattern="\S*\S\.\S\S*"
				placeholder="example.com"
				spellcheck="false"
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
{#snippet dialogNewButtons()}
	<div class="gap-between flex w-full items-center justify-between">
		<ButtonSecondary
			content="Get from clipboard"
			icon={Clipboard}
			onclick={async () =>
				(dialogInputElement.value = (await navigator.clipboard.readText()).trim())}
		/>
	</div>
{/snippet}

<Dialog
	buttons={dialogConfirmButtons}
	description={dialogConfirmDescription}
	title="Confirm selection"
	bind:alertOpen={dialogConfirmOpen}
/>
{#snippet dialogConfirmDescription()}
	<div class="mb-2 text-stone-700 dark:text-stone-300">
		{#if dialogLinks.length === 0}
			<span class="leading-8">
				Found no links in submitted files! Please make sure each link begins with
				<code class="rounded bg-stone-300 bg-opacity-40 p-1 font-mono dark:bg-stone-700">
					https://
				</code>
			</span>
		{:else if dialogLinks.length === 1}
			<span>Do you want to add the following link?</span>
		{:else}
			<span>Please select the links you want to add</span>
		{/if}
	</div>
	<div class="flex w-full flex-col">
		{#each dialogLinks as link}
			<Checkbox.Root
				class="flex w-full items-start justify-start gap-2 bg-stone-500 bg-opacity-0 p-2 text-start transition first:rounded-t last:rounded-b hocus:bg-opacity-10"
				checked={dialogLinks.length === 1}
				onCheckedChange={(checked) => {
					if (checked) dialogCheckedLinks.push(link);
					else
						dialogCheckedLinks = dialogCheckedLinks.filter((checkedLink) => checkedLink !== link);
				}}
			>
				<Checkbox.Indicator
					class="flex min-h-6 min-w-6 items-center justify-center rounded border border-stone-600 p-0.5 text-stone-200 transition data-[state=checked]:bg-stone-800 dark:text-stone-800 dark:data-[state=checked]:bg-stone-200"
					let:isChecked
				>
					{#if isChecked}
						<Check class="size-4" />
					{/if}
				</Checkbox.Indicator>
				<span class="break-all">
					{link}
				</span>
			</Checkbox.Root>
		{/each}
	</div>
{/snippet}
{#snippet dialogConfirmButtons()}
	<div class="flex w-full items-center justify-between">
		<ButtonSecondary
			content="Cancel"
			onclick={() => {
				dialogLinks = [];
				dialogCheckedLinks = [];
				dialogConfirmOpen = false;
			}}
		/>
		{#if dialogLinks.length > 0}
			<ButtonPrimary
				content="Add"
				disabled={dialogCheckedLinks.length === 0}
				onclick={async () => {
					dialogConfirmOpen = false;
					dialogCheckedLinks.map((link) => newLink(link));
					dialogLinks = [];
				}}
			/>
		{/if}
	</div>
{/snippet}
