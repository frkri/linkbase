<script lang="ts">
	import type { SectionType } from '$lib/types/settings';

	import Alert from '$lib/components/common/Alert.svelte';
	import ButtonPrimary from '$lib/components/common/ButtonPrimary.svelte';
	import ButtonSecondary from '$lib/components/common/ButtonSecondary.svelte';
	import SettingsItem from '$lib/components/settings/SettingsItem.svelte';
	import { db, dbInner } from '$lib/modules/storage/db/client';
	import { AlertDialog } from 'bits-ui';
	import { ArrowRight, Download, Upload } from 'lucide-svelte';

	const sections: SectionType[] = [
		{
			title: 'General',
			description: 'Settings for the whole site'
		},
		{
			title: 'Preferences',
			description: 'Preferences for the current user'
		},
		{
			title: 'Remote',
			description: 'Settings for remote services'
		},

		{
			title: 'Database',
			description: 'Settings for the local database'
		}
	];

	let sectionsContainer: HTMLDivElement | undefined = $state();
	let visibleSections: SectionType[] = $state([]);

	let deleteAlertOpen = $state(false);

	const observer = new IntersectionObserver(
		(entries) =>
			entries.forEach((e) => {
				if (e.isIntersecting)
					visibleSections.push(
						sections.find((section) => section.title === e.target.id) || sections[0]
					);
				else visibleSections = visibleSections.filter((section) => section.title !== e.target.id);
			}),
		{
			threshold: 0.1
		}
	);

	$effect(() => {
		if (!sectionsContainer) return;

		sectionsContainer.querySelectorAll('section').forEach((section) => observer.observe(section));
		return () => observer.disconnect();
	});

	async function exportDatabase() {
		const file = await dbInner.getDatabaseFile();
		const a = document.createElement('a');
		a.download = `linkbase_${new Date().toISOString().replace(/:/g, '-')}.db`;
		a.href = URL.createObjectURL(file);
		a.click();
		a.remove();
	}

	async function importDatabase() {
		const input = document.createElement('input');
		input.type = 'file';
		input.onchange = async () => {
			const file = input.files?.[0];
			if (!file) return;

			await dbInner.overwriteDatabaseFile(file);
		};
		input.click();
	}

	async function dropLinks() {
		db.deleteFrom('links').execute();
	}

	async function countLinks() {
		return await db.selectFrom('links').select(db.fn.countAll().as('count')).execute();
	}
</script>

<div class="mb-24 flex">
	<div class="sticky top-16 h-0 max-md:hidden">
		<h1 class="row-span-2 mb-4 text-xl font-medium">Settings</h1>
		<aside class="flex min-w-36 flex-col text-stone-500">
			{#each sections as section}
				<a
					class="border-l border-stone-300 pl-4 text-lg data-[visible=true]:border-stone-700 data-[visible=true]:font-medium data-[visible=true]:text-stone-900 hocus:bg-opacity-40 hocus:text-stone-700 motion-safe:transition dark:border-stone-600 dark:data-[visible=true]:border-stone-300 dark:data-[visible=true]:text-stone-300 dark:hocus:text-stone-300"
					data-visible={visibleSections.find((s) => s.title === section.title) ? 'true' : 'false'}
					href="#{section.title}"
				>
					{section.title}
				</a>
			{/each}
		</aside>
	</div>
	<div class="w-full px-2">
		<div bind:this={sectionsContainer} class="flex flex-col gap-12">
			<section id={sections[0].title}>
				{@render sectionHeader(sections[0])}
				<SettingsItem
					description={'Exporting the database will download a copy of the current database. Importing a database will overwrite the current database with the imported one.'}
					title={'Import and Export'}
				>
					<div></div>
				</SettingsItem>
			</section>

			<section id={sections[1].title}>
				{@render sectionHeader(sections[1])}
				<SettingsItem
					description={'Exporting the database will download a copy of the current database. Importing a database will overwrite the current database with the imported one.'}
					title={'Import and Export'}
				>
					<div></div>
				</SettingsItem>
			</section>

			<section id={sections[2].title}>
				{@render sectionHeader(sections[2])}
				<SettingsItem
					description={'Exporting the database will download a copy of the current database. Importing a database will overwrite the current database with the imported one.'}
					title={'Import and Export'}
				>
					<div></div>
				</SettingsItem>
			</section>

			<section id={sections[3].title}>
				{@render sectionHeader(sections[3])}
				<SettingsItem
					description={'Exporting the database will download a copy of the current database. Importing a database will overwrite the current database with the imported one.'}
					title={'Import and Export'}
				>
					<div class="flex justify-between gap-8">
						<div class="flex">
							<ButtonSecondary
								class="flex h-12 min-w-16 flex-row items-center justify-center gap-2 rounded-l border border-r-0 border-slate-900 bg-stone-400 bg-opacity-0 stroke-slate-700 p-2 text-sm text-stone-800 transition hocus:bg-opacity-15 md:min-w-44 dark:border-slate-100 dark:bg-stone-300 dark:bg-opacity-0 dark:stroke-slate-100 dark:text-slate-100"
								content="Export database"
								icon={Upload}
								onclick={exportDatabase}
							/>
							<ButtonSecondary
								class="flex h-12 min-w-16 flex-row items-center justify-center gap-2 rounded-r border border-slate-900 bg-stone-400 bg-opacity-0 stroke-slate-700 p-2 text-sm text-stone-800 transition hocus:bg-opacity-15 md:min-w-44 dark:border-slate-100 dark:bg-stone-300 dark:bg-opacity-0 dark:stroke-slate-100 dark:text-slate-100"
								content="Import database"
								icon={Download}
								onclick={importDatabase}
							/>
						</div>
					</div>
				</SettingsItem>
				<SettingsItem
					description={'This will delete all data in the database. This action cannot be undone.'}
					title={'Delete database'}
				>
					<div>
						<ButtonPrimary
							class="flex min-h-10 min-w-10 flex-row items-center justify-center gap-2 rounded border border-slate-900 bg-stone-900 p-2 text-sm text-stone-100 transition hocus:border-red-500 hocus:bg-stone-100 hocus:text-red-500 dark:border-stone-100 dark:bg-stone-100 dark:stroke-slate-100 dark:text-slate-900 dark:hocus:bg-stone-900"
							onclick={() => (deleteAlertOpen = true)}
						>
							Delete database
						</ButtonPrimary>
					</div>
				</SettingsItem>
			</section>
		</div>
	</div>
</div>

{#snippet sectionHeader(section: SectionType)}
	<h2 class="text-lg font-medium md:text-xl">{section.title}</h2>
	<p class="mb-4 border-b border-stone-600 pb-2 tracking-tight text-stone-500">
		{section.description}
	</p>
{/snippet}

<Alert
	buttons={deleteAlertButtons}
	description={deleteAlertDescription}
	title="Delete database?"
	bind:alertOpen={deleteAlertOpen}
></Alert>

{#snippet deleteAlertDescription()}
	This will delete all
	{#await countLinks()}
		...
	{:then count}
		{count[0].count}
	{/await}
	links in the database. This action cannot be undone.
{/snippet}

{#snippet deleteAlertButtons()}
	<AlertDialog.Cancel>
		<ButtonSecondary content="Cancel" />
	</AlertDialog.Cancel>
	<AlertDialog.Action>
		<ButtonPrimary
			class="flex min-h-10 min-w-10 flex-row items-center justify-center gap-2 rounded border border-slate-900 bg-stone-900 p-2 text-sm text-stone-100 transition hocus:border-red-500 hocus:bg-stone-200 hocus:text-red-500 dark:border-stone-100 dark:bg-stone-100 dark:stroke-slate-100 dark:text-slate-900 dark:hocus:bg-stone-900"
			onclick={dropLinks}
		>
			<div class="flex min-w-24 flex-row items-center justify-center gap-1">
				Continue
				<ArrowRight
					class="h-0 w-0 stroke-transparent transition-all group-hover/button:h-4 group-hover/button:w-4 group-hover/button:stroke-inherit group-focus/button:h-4 group-focus/button:w-4 group-focus/button:stroke-inherit"
				/>
			</div>
		</ButtonPrimary>
	</AlertDialog.Action>
{/snippet}
