<script lang="ts">
	import type { Snippet } from 'svelte';

	import { Button, type ButtonProps } from 'bits-ui';

	let {
		children,
		...props
	}: {
		children: Snippet;
	} & ButtonProps = $props();
</script>

<Button.Root
	class="flex min-h-6 min-w-6 flex-row items-center justify-center gap-2 rounded border border-slate-900 bg-stone-400 bg-opacity-0 stroke-slate-700 p-2 text-sm text-stone-800 outline-none transition hocus:bg-opacity-15 dark:border-slate-100 dark:bg-stone-300 dark:bg-opacity-0 dark:stroke-slate-100 dark:text-slate-100"
	{...props}
>
	{@render children()}
</Button.Root>
