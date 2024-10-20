<script lang="ts">
	import Header from '$lib/components/layout/Header.svelte';

	import '../app.css';
</script>

<main class="mx-auto max-w-screen-xl px-1 md:px-2">
	<Header />
	<div class="px-1 md:px-2">
		<slot />
	</div>
</main>
