<script lang="ts">
	import type { LinkItem } from '$lib/types/item';

	import Tooltip from '$lib/components/Tooltip.svelte';
	import { type Icon } from 'lucide-svelte';
	import { ArrowRight, Calendar, Eye } from 'lucide-svelte';
	import { type ComponentType } from 'svelte';
	import { fly } from 'svelte/transition';

	let { createdAt, description, icon, title, url, views }: LinkItem = $props();
</script>

<li
	class="flex h-16 w-full list-none flex-row items-center justify-start gap-4 rounded bg-stone-300 bg-opacity-10 transition hocus:bg-opacity-40 md:min-h-24 dark:bg-stone-700 dark:bg-opacity-10"
>
	<img
		class="my-2 ml-4 max-h-10 min-h-10 w-full min-w-10 max-w-10 rounded-md bg-stone-100 bg-opacity-40 object-cover p-1 text-center text-[0.5rem] hocus:bg-opacity-85 md:max-h-14 md:min-h-14 md:min-w-14 md:max-w-14 dark:bg-stone-700 dark:bg-opacity-40"
		alt={icon.alt}
		crossorigin="anonymous"
		src={icon.src}
	/>
	<a class="group my-2 mr-4 flex h-full flex-col items-start justify-center" href={url.toString()}>
		<div class="flex w-full items-center justify-between gap-4">
			<span class="line-clamp-1 w-full text-sm font-medium tracking-tight md:text-lg">
				{title}
			</span>
			<Tooltip
				content={url.toString()}
				side="left"
				transition={fly}
				transitionConfig={{ duration: 150, x: 4 }}
			>
				<ArrowRight
					class="h-3 w-3 opacity-0 transition group-focus-within:opacity-100 group-hover:opacity-100 md:h-4 md:w-4"
				/>
			</Tooltip>
		</div>
		<div>
			<p
				class="line-clamp-1 min-w-0 align-top text-[0.6rem] leading-3 tracking-tight text-stone-400 md:text-sm"
			>
				{description}
			</p>
		</div>
		<div class="flex flex-row items-center justify-start gap-4 text-xs text-stone-500">
			{@render itemMetadata('Created at', createdAt.toLocaleDateString(), Calendar)}
			{@render itemMetadata('Views', views, Eye)}
		</div>
	</a>
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
			<Icon class="h-2.5 w-2.5 md:h-3 md:w-3" />
			<span class="text-[0.5rem] md:text-sm">{value}</span>
		</div>
	</Tooltip>
{/snippet}
