<script lang="ts">
	import { Status } from "$lib/types/status";

    let {
        initials = 'AB',
        syncStatus = $bindable(Status.none)
    }: {
        initials?: string;
        syncStatus?: Status;
    } = $props();
</script>

<div 
class="rounded-full text-xs transition-colors font-medium flex items-center dark:bg-stone-800 bg-stone-200 justify-center h-8 w-8 border-2 dark:border-stone-800 border-stone-200 !border-opacity-20"
    class:!border-red-400={syncStatus === Status.error}
    class:!border-emerald-400={syncStatus === Status.success}
    class:!border-yellow-400={syncStatus === Status.pending}
    class:!animate-pulse={syncStatus === Status.pending}
    >
 {initials}
</div>
