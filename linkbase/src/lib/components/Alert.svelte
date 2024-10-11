<script lang="ts">
	import type { Snippet } from 'svelte';

	import { AlertDialog } from 'bits-ui';
	import { ArrowRight } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';

	import ButtonPrimary from './button/ButtonPrimary.svelte';

	let {
		alertOpen = $bindable(false),
		buttons = defaultButtons,
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

<AlertDialog.Root closeOnOutsideClick={true} bind:open={alertOpen}>
	{#if trigger}
		{@render trigger()}
	{/if}
	<AlertDialog.Portal>
		<AlertDialog.Overlay
			class="fixed inset-0 z-10 bg-black bg-opacity-30"
			inTransitionConfig={{ duration: 80 }}
			transition={fade}
		/>
		<AlertDialog.Content
			class="fixed left-[50%] top-[50%] z-10 grid w-full max-w-[90%] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg bg-stone-200 px-6 py-4 sm:max-w-lg md:w-full dark:bg-stone-800"
			inTransition={fly}
			inTransitionConfig={{ duration: 120, y: 24 }}
		>
			<div class="flex flex-col gap-4 pb-6">
				{#if typeof title === 'string'}
					<AlertDialog.Title class="text-lg font-bold">
						{title}
					</AlertDialog.Title>
				{:else}
					{@render title()}
				{/if}
				{#if typeof description === 'string'}
					<AlertDialog.Description class="text-sm text-stone-600 dark:text-stone-400">
						{description}
					</AlertDialog.Description>
				{:else}
					{@render description()}
				{/if}
			</div>
			<div class="flex w-full flex-row items-center justify-end gap-2">
				{#if buttons}
					{@render buttons()}
				{/if}
			</div>
		</AlertDialog.Content>
	</AlertDialog.Portal>
</AlertDialog.Root>

{#snippet defaultButtons()}
	<AlertDialog.Action>
		<ButtonPrimary>
			<div class="flex min-w-24 flex-row items-center justify-center gap-1">
				Continue
				<ArrowRight
					class="h-0 w-0 stroke-transparent transition-all group-hover/button:h-4 group-hover/button:w-4 group-hover/button:stroke-inherit group-focus/button:h-4 group-focus/button:w-4 group-focus/button:stroke-inherit"
				/>
			</div>
		</ButtonPrimary>
	</AlertDialog.Action>
{/snippet}
