<script lang="ts">
	import { version } from '$app/environment';
	import { Status } from '$lib/types/status';
	import { DropdownMenu } from 'bits-ui';
	import { Info, Settings } from 'lucide-svelte';
	import { fly } from 'svelte/transition';

	import Alert from '../Alert.svelte';

	let {
		initials = 'AB',
		syncStatus = $bindable(Status.none)
	}: {
		initials?: string;
		syncStatus?: Status;
	} = $props();

	let aboutOpen = $state(false);
</script>

<DropdownMenu.Root preventScroll={false}>
	<DropdownMenu.Trigger>
		<div
			class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-stone-300 !border-opacity-20 bg-stone-300 text-xs font-medium transition-colors dark:border-stone-800 dark:bg-stone-800"
			class:!animate-pulse={syncStatus === Status.pending}
			class:!border-emerald-400={syncStatus === Status.success}
			class:!border-red-400={syncStatus === Status.error}
			class:!border-yellow-400={syncStatus === Status.pending}
		>
			{initials}
		</div>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content
		align="end"
		alignOffset={8}
		class="flex flex-col gap-4 rounded border border-slate-500 border-opacity-30 bg-stone-100 bg-opacity-40 p-2 text-sm text-stone-600 backdrop-blur-sm *:flex *:flex-row *:place-items-center *:gap-2 dark:bg-stone-900 dark:bg-opacity-40 dark:text-stone-400"
		side="top"
		sideOffset={16}
		transition={fly}
		transitionConfig={{ duration: 150, x: 0, y: -8 }}
	>
		<DropdownMenu.Item
			class="hocus:stroke-stone-800 hocus:text-stone-800 dark:hocus:stroke-stone-300 dark:hocus:text-stone-300"
			href="settings"
		>
			<Settings class="h-4 w-4" />Settings
		</DropdownMenu.Item><DropdownMenu.Item
			class="cursor-pointer hocus:stroke-stone-800 hocus:text-stone-800 dark:hocus:stroke-stone-300 dark:hocus:text-stone-300"
			onclick={() => (aboutOpen = true)}
		>
			<Info class="h-4 w-4" />
			About
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<Alert bind:alertOpen={aboutOpen} description="Running linkbase version {version}" title="About"
></Alert>
