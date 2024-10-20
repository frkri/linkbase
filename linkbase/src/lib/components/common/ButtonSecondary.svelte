<script lang="ts">
	import type { ComponentType, Snippet } from 'svelte';

	import { type Icon } from 'lucide-svelte';
	import { type HTMLButtonAttributes } from 'svelte/elements';

	let {
		children,
		content = '',
		icon,
		...props
	}: {
		children?: Snippet;
		content?: string;
		icon?: ComponentType<Icon>;
	} & HTMLButtonAttributes = $props();
</script>

<button
	class="group/button flex min-h-10 min-w-10 flex-row items-center justify-center gap-2 rounded border border-slate-900 bg-stone-400 bg-opacity-0 stroke-slate-700 p-2 text-sm text-stone-800 transition hocus:bg-opacity-15 dark:border-slate-100 dark:bg-stone-300 dark:bg-opacity-0 dark:stroke-slate-100 dark:text-slate-100"
	{...props}
>
	{#if children}
		{@render children()}
	{:else}
		{@render defaultContent(content, icon)}
	{/if}
</button>

{#snippet defaultContent(content: string, Icon?: ComponentType<Icon>)}
	<div class="flex flex-row items-center justify-center gap-1.5 md:min-w-24">
		{#if Icon}
			<Icon class="size-4 min-h-4 min-w-4 stroke-inherit"></Icon>
		{/if}
		{#if content}
			<span class="text-sm">{content}</span>
		{/if}
	</div>
{/snippet}
