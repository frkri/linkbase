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
	class="group/button flex min-h-10 min-w-10 flex-row items-center justify-center gap-2 rounded border border-slate-900 bg-stone-900 stroke-slate-700 p-2 text-sm text-stone-100 transition hocus:bg-stone-100 hocus:text-stone-900 dark:border-stone-100 dark:bg-stone-100 dark:stroke-slate-100 dark:text-slate-900 dark:hocus:bg-stone-900 dark:hocus:text-stone-100"
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
			<Icon
				class="h-4 w-4 transition-all group-hover/button:h-4 group-hover/button:w-4 group-hover/button:stroke-inherit group-focus/button:h-4 group-focus/button:w-4 group-focus/button:stroke-inherit md:h-0 md:w-0 md:stroke-transparent"
			></Icon>
		{/if}
		{#if content}
			<span class="text-sm">{content}</span>
		{/if}
	</div>
{/snippet}
