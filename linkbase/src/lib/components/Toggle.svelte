<script lang="ts">
	import { ToggleGroup, type ToggleGroupProps } from 'bits-ui';
	import { type Snippet } from 'svelte';

	let {
		children,
		toggleValue = $bindable(''),
		...props
	}: { children: Snippet; toggleValue: string | undefined } & ToggleGroupProps<'single'> = $props();
</script>

<ToggleGroup.Root
	{...props}
	class="flex h-10 w-fit items-center justify-start gap-2 rounded border border-neutral-500 border-opacity-40 p-1 transition focus-within:border-opacity-100"
	bind:value={toggleValue}
>
	{@render children()}
</ToggleGroup.Root>
