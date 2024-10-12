<script lang="ts">
	import { Select, type Selected, type SelectProps } from 'bits-ui';
	import { Check } from 'lucide-svelte';
	import { ChevronDown } from 'lucide-svelte';
	import { fly } from 'svelte/transition';

	let {
		placeholder = '',
		items,
		...props
	}: {
		placeholder?: string;
		items: Selected<string>[];
	} & SelectProps<string> = $props();
</script>

<Select.Root {items} {...props}>
	<Select.Trigger
		class="flex h-10 w-48 items-center justify-between rounded border border-neutral-500 border-opacity-40 px-4 py-2 transition focus-within:border-opacity-100"
	>
		<Select.Value class="line-clamp-1 text-start text-sm" {placeholder} />
		<ChevronDown class="size-4" />
	</Select.Trigger>
	<Select.Content
		class="z-20 flex w-full flex-col items-center rounded border border-neutral-500 bg-stone-100 p-2 text-sm dark:bg-stone-900"
		align="center"
		side="bottom"
		sideOffset={8}
		transition={fly}
		transitionConfig={{ duration: 150, x: 0, y: -4 }}
	>
		{#each items as item}
			<Select.Item
				class="flex h-8 w-full cursor-pointer items-center justify-between gap-2 rounded bg-stone-500 bg-opacity-0 p-2 hocus:bg-opacity-20 md:h-10"
				label={item.label}
				value={item.value}
			>
				{item.label}
				<Select.ItemIndicator>
					<Check class="size-4" />
				</Select.ItemIndicator>
			</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>
