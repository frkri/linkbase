<script lang="ts">
	import type { Snippet } from 'svelte';

	import { Tooltip, type TooltipContentProps } from 'bits-ui';

	let {
		children,
		content,
		...props
	}: {
		children: Snippet;
		content: Snippet | string;
	} & TooltipContentProps = $props();
</script>

<Tooltip.Root openDelay={200}>
	<Tooltip.Trigger>
		{@render children()}
	</Tooltip.Trigger>
	<Tooltip.Content
		class="rounded border border-stone-500 border-opacity-30 bg-stone-200 p-1 text-xs font-medium text-stone-700 drop-shadow-xl md:p-2 md:text-sm dark:bg-stone-800 dark:text-stone-300"
		{...props}
	>
		{#if typeof content === 'string'}
			{content}
		{:else}
			{@render content()}
		{/if}
	</Tooltip.Content>
</Tooltip.Root>
