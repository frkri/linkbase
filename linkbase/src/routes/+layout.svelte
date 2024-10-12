<script lang="ts">
	import Nav from '$lib/components/nav/Nav.svelte';

	import '../app.css';
</script>

<svelte:head>
	<title>linkbase</title>
</svelte:head>

<main class="mx-auto max-w-screen-xl p-1 md:p-4">
	<Nav />
	<div class="p-2">
		<slot />
	</div>
</main>
