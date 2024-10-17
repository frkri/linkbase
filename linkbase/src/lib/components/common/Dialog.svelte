<script lang="ts">
	import type { Snippet } from 'svelte';

	import { Dialog } from 'bits-ui';
	import { X } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';

	let {
		alertOpen = $bindable(false),
		buttons,
		description = '',
		title = '',
		trigger
	}: {
		alertOpen?: boolean;
		buttons?: Snippet;
		description?: Snippet | string;
		title?: Snippet | string;
		trigger?: Snippet;
	} = $props();
</script>

<Dialog.Root closeOnOutsideClick={true} bind:open={alertOpen}>
	{#if trigger}
		{@render trigger()}
	{/if}
	<Dialog.Portal>
		<Dialog.Overlay
			class="fixed inset-0 z-40 bg-black bg-opacity-30"
			inTransitionConfig={{ duration: 80 }}
			transition={fade}
		/>
		<Dialog.Content
			class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-[90%] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg bg-stone-200 px-6 py-4 md:max-w-xl dark:bg-stone-800"
			inTransition={fly}
			inTransitionConfig={{ duration: 120, y: 24 }}
		>
			<Dialog.Close
				class="absolute right-5 top-5 rounded-md bg-stone-500 bg-opacity-0 p-1 text-stone-500 transition hocus:bg-opacity-5 hocus:text-stone-700 dark:hocus:text-stone-300"
			>
				<X class="size-4" />
			</Dialog.Close>
			<div class="flex flex-col gap-4 pb-2">
				{#if typeof title === 'string'}
					<Dialog.Title class="text-lg font-bold">
						{title}
					</Dialog.Title>
				{:else}
					{@render title()}
				{/if}
				{#if typeof description === 'string'}
					<Dialog.Description class="text-sm text-stone-600 dark:text-stone-400">
						{description}
					</Dialog.Description>
				{:else}
					{@render description()}
				{/if}
			</div>
			<div class="flex w-full flex-row items-center justify-end gap-2">
				{#if buttons}
					{@render buttons()}
				{/if}
			</div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
