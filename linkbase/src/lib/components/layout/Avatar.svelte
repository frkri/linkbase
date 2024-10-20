<script lang="ts">
	import { version } from '$app/environment';
	import Alert from '$lib/components/common/Alert.svelte';
	import { dbInner } from '$lib/modules/storage/db/client';
	import { Status } from '$lib/types/status';
	import { DropdownMenu } from 'bits-ui';
	import { Info, Settings } from 'lucide-svelte';
	import { fly } from 'svelte/transition';

	let {
		initials,
		syncStatus = $bindable(Status.none)
	}: {
		initials: string;
		syncStatus?: Status;
	} = $props();

	let aboutOpen = $state(false);
	let isServiceWorkerReady = async () =>
		'serviceWorker' in navigator && navigator.serviceWorker.controller !== null;
	let storageQuota = async () => {
		if ('storage' in navigator) {
			const { quota, usage } = await navigator.storage.estimate();
			return `${usage ? (usage / 1024 / 1024).toFixed(2) : 0} / ${quota ? (quota / 1024 / 1024).toFixed(2) : 0}MB (${quota && usage ? ((usage / quota) * 100).toFixed(2) : 0}%)`;
		}
		return 'not supported';
	};
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
		class="z-30 flex flex-col gap-4 rounded border border-stone-500 border-opacity-60 bg-stone-100 bg-opacity-60 p-2 text-sm text-stone-700 backdrop-blur-sm *:flex *:flex-row *:place-items-center *:gap-2 dark:bg-stone-900 dark:bg-opacity-60 dark:text-stone-300"
		align="end"
		alignOffset={8}
		side="top"
		sideOffset={16}
		transition={fly}
		transitionConfig={{ duration: 150, x: 0, y: -8 }}
	>
		<DropdownMenu.Item
			class="hocus:stroke-stone-900 hocus:text-stone-900 dark:hocus:stroke-stone-100 dark:hocus:text-stone-100"
			href="settings"
		>
			<Settings class="h-4 w-4" />
			Settings
		</DropdownMenu.Item>
		<DropdownMenu.Item
			class="cursor-pointer hocus:stroke-stone-900 hocus:text-stone-900 dark:hocus:stroke-stone-100 dark:hocus:text-stone-100"
			onclick={() => (aboutOpen = true)}
		>
			<Info class="h-4 w-4" />
			About
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<Alert {description} title="About" bind:alertOpen={aboutOpen}></Alert>
{#snippet description()}
	<p>
		<span class="font-medium">Linkbase</span> is a local first bookmarking app that allows you to save,
		organize, search and archive your favorite websites.
	</p>
	<h2 class="font-bold">Enviroment Info</h2>
	<div
		class="min-h-56 font-mono text-[0.7rem] *:flex *:flex-row *:items-center *:justify-between *:gap-2"
	>
		{@render item('Version', version)}
		{@render item('Offline Ready', isServiceWorkerReady())}
		{@render item('Service Workers', 'serviceWorker' in navigator ? 'supported' : 'not supported')}
		{@render item('Storage Quota', storageQuota())}
		{#await dbInner.getDatabaseInfo()}
			<span>pending</span>
		{:then info}
			{@render item(
				'Database Size',
				info.databaseSizeBytes ? (info.databaseSizeBytes / 1024 / 1024).toFixed(2) : 0
			)}
			{@render item('Database Path', info.databasePath)}
			{@render item('Database Type', info.storageType)}
			{@render item('Database Persisted', info.persisted)}
		{/await}
	</div>
{/snippet}

{#snippet item(
	name: string,
	value: boolean | number | Promise<boolean | string> | string | undefined
)}
	<button
		class="w-full px-1 py-0.5 first:rounded-tl first:rounded-tr last:rounded-bl last:rounded-br hocus:bg-stone-300 dark:hocus:bg-stone-700"
		onclick={async () => navigator.clipboard.writeText(`${name}: ${await value}`)}
	>
		<span class="font-medium">{name}</span>
		{#await value}
			<span>pending</span>
		{:then val}
			<span>{val}</span>
		{/await}
	</button>
{/snippet}
