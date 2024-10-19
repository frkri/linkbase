<script lang="ts">
	import type { ComponentType } from 'svelte';

	import { ToggleGroup } from 'bits-ui';
	import { type Icon as IconType } from 'lucide-svelte';

	let {
		type,
		Icon
	}: {
		type: string;
		Icon: ComponentType<IconType>;
	} = $props();
</script>

<ToggleGroup.Item
	class="rounded p-1 text-neutral-500 transition data-[state=on]:bg-stone-200 data-[state=on]:text-stone-900 hocus:text-stone-900 dark:data-[state=on]:bg-stone-800 dark:data-[state=on]:text-stone-100 dark:hocus:text-stone-100"
	aria-label={`Switch to ${type} view`}
	value={type}
>
	<Icon class="h-4 w-4 sm:h-5 sm:w-5"></Icon>
</ToggleGroup.Item>
