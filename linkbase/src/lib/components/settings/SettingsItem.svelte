<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title,
		description,
		children
	}: {
		title: string;
		description: string;
		children: Snippet;
	} = $props();
</script>

<div class="mb-4">
	<h3 class="mb-2">{title}</h3>
	<div class="flex justify-between gap-8">
		<p class="text-xs">
			{description}
		</p>
		{@render children()}
	</div>
</div>
