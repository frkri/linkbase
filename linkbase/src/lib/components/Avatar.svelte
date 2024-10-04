<script lang="ts">
	import { Status } from '$lib/types/status';

	let {
		initials = 'AB',
		syncStatus = $bindable(Status.none)
	}: {
		initials?: string;
		syncStatus?: Status;
	} = $props();
</script>

<div
	class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-stone-200 !border-opacity-20 bg-stone-200 text-xs font-medium transition-colors dark:border-stone-800 dark:bg-stone-800"
	class:!animate-pulse={syncStatus === Status.pending}
	class:!border-emerald-400={syncStatus === Status.success}
	class:!border-red-400={syncStatus === Status.error}
	class:!border-yellow-400={syncStatus === Status.pending}
>
	{initials}
</div>
