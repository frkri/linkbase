<script lang="ts">
	import type { SectionType } from '$lib/types/settings';

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
</script>

<div class="flex h-full gap-4">
	<div class="max-md:hidden">
		<h1 class="row-span-2 mb-6 text-xl font-bold md:text-2xl">Settings</h1>
		<aside class="flex min-w-36 flex-col text-stone-500">
			{#each sections as section}
				<a
					class="border-l border-stone-600 pl-4 text-lg data-[visible=true]:border-stone-300 data-[visible=true]:font-medium data-[visible=true]:text-stone-300 hocus:bg-opacity-40 hocus:text-stone-300 motion-safe:transition"
					data-visible={visibleSections.find((s) => s.title === section.title) ? 'true' : 'false'}
					href="#{section.title}"
				>
					{section.title}
				</a>
			{/each}
		</aside>
	</div>
	<div class="max-h-[calc(100svh-120px)] w-full overflow-y-scroll px-2">
		<div bind:this={sectionsContainer} class="flex flex-col gap-12">
			<section id={sections[0].title}>
				{@render section(sections[0])}
			</section>
			<section id={sections[1].title}>
				{@render section(sections[1])}
			</section>
			<section id={sections[2].title}>
				{@render section(sections[2])}
			</section>
			<section id={sections[3].title}>
				{@render section(sections[3])}
			</section>
		</div>
	</div>
</div>

{#snippet section(section: SectionType)}
	<h2 class="mb-2 text-lg font-medium md:text-xl">{section.title}</h2>
	<p class="mb-4 border-b border-stone-600 pb-2 tracking-tight text-stone-400">
		{section.description}
	</p>
{/snippet}
