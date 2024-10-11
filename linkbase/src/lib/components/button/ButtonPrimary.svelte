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
	class="group/button flex min-h-6 min-w-6 flex-row items-center justify-center gap-2 rounded border border-slate-900 bg-stone-900 stroke-slate-700 p-2 text-sm text-stone-100 transition hocus:bg-stone-100 hocus:text-stone-900 dark:border-stone-100  dark:bg-stone-100  dark:stroke-slate-100 dark:text-slate-900  dark:hocus:bg-stone-900 dark:hocus:text-stone-100"
	{...props}
>
	{@render children()}
</Button.Root>
