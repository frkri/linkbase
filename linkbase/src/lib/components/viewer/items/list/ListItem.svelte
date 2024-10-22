<script lang="ts">
	import type { LinkItem } from '$lib/modules/storage/db/schema';

	import { invalidate } from '$app/navigation';
	import Tooltip from '$lib/components/common/Tooltip.svelte';
	import { db } from '$lib/modules/storage/db/client';
	import { ArrowRight, Calendar, Clock, Eye, type Icon, Trash } from 'lucide-svelte';
	import { type ComponentType } from 'svelte';
	import { fly } from 'svelte/transition';

	let {
		id,
		imgSrc,
		imgType,
		imgAlt,
		createdAt,
		description,
		title,
		url,
		views,
		viewedAt
	}: LinkItem = $props();
</script>

<li
	class="flex min-h-24 w-full list-none flex-row items-center justify-start gap-2 rounded bg-stone-300 bg-opacity-30 pl-4 transition hocus:bg-opacity-40 md:gap-4 dark:bg-stone-700 dark:bg-opacity-10"
>
	<button
		class="group relative"
		aria-label="Remove item"
		onclick={() => {
			db.deleteFrom('links').where('id', '=', id).execute();
			invalidate('load:query');
		}}
	>
		<div
			class="my-2 rounded-md bg-stone-300 bg-opacity-40 transition dark:bg-stone-700 dark:bg-opacity-40"
		>
			<Trash
				class="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 opacity-0 transition group-focus-within:opacity-100 group-hover:opacity-100"
			/>
			<img
				class="max-h-14 min-h-14 w-full min-w-14 max-w-14 overflow-hidden rounded-md object-cover p-1 text-center text-[0.5rem] transition group-focus-within:opacity-15 group-hover:opacity-15"
				alt={imgAlt}
				crossorigin="anonymous"
				src={imgSrc
					? URL.createObjectURL(new Blob([imgSrc], { type: imgType || 'image/png' }))
					: ''}
			/>
		</div>
	</button>
	<button
		class="group my-2 mr-4 flex h-full w-full flex-col items-start justify-center text-start"
		aria-label="Open link in new tab"
		onmousedown={() => {
			views++;
			viewedAt = new Date().getTime();
			db.updateTable('links').set({ views, viewedAt }).where('id', '=', id).execute();
			window.open(url.toString(), '_blank', 'noopener,noreferrer');
		}}
	>
		<div class="flex w-full items-center justify-between gap-4">
			<span class="line-clamp-1 w-full text-base font-medium tracking-tight md:text-lg">
				{title}
			</span>
			<Tooltip
				content={url.toString()}
				side="left"
				transition={fly}
				transitionConfig={{ duration: 150, x: 4 }}
			>
				<ArrowRight
					class="h-4 w-4 opacity-0 transition group-focus-within:opacity-100 group-hover:opacity-100"
				/>
			</Tooltip>
		</div>
		<div>
			<p
				class="line-clamp-1 min-h-[0.6rem] min-w-0 align-top text-[0.6rem] leading-3 tracking-tight text-stone-400 md:text-sm"
			>
				{description}
			</p>
		</div>
		<div class="flex flex-row items-center justify-start gap-2 text-xs text-stone-500 md:text-sm">
			{@render itemMetadata('Created at', new Date(createdAt).toLocaleDateString(), Calendar)}
			<div class="block sm:hidden">
				{@render itemMetadata('Last viewed at', new Date(viewedAt).toLocaleTimeString(), Clock)}
			</div>
			<div class="hidden sm:block">
				{@render itemMetadata('Last viewed at', new Date(viewedAt).toLocaleString(), Clock)}
			</div>
			{@render itemMetadata('Views', views, Eye)}
		</div>
	</button>
</li>

{#snippet itemMetadata(description: string, value: number | string, Icon: ComponentType<Icon>)}
	<Tooltip
		content={description}
		side="bottom"
		transition={fly}
		transitionConfig={{ duration: 150, y: 4 }}
	>
		<div
			class="flex flex-row place-items-center gap-1 hocus:text-stone-600 dark:hocus:text-stone-400"
		>
			<Icon class="h-3 w-3" />
			<span>{value}</span>
		</div>
	</Tooltip>
{/snippet}
