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
	class="flex min-h-12 min-w-24 flex-row items-center justify-between gap-2 rounded border border-slate-100 bg-slate-100 bg-opacity-0 p-2 text-slate-100 outline-none transition hocus:bg-opacity-15"
	{...props}
>
	{@render children()}
</Button.Root>
