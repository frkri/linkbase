<script lang="ts">
	import Header from '$lib/components/layout/Header.svelte';

	import '../app.css';
</script>

<svelte:head>
	<title>linkbase</title>
</svelte:head>

<main class="mx-auto max-w-screen-xl p-2">
	<Header />
	<div class="p-4">
		<slot />
	</div>
</main>
