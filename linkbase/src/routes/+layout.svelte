<script>
	import Header from '$lib/components/nav/Header.svelte';

	import '../app.css';
</script>

<svelte:head>
	<title>linkbase</title>
</svelte:head>

<main class="mx-auto max-w-screen-xl p-1 md:p-4">
	<Header />
	<div class="p-4">
		<slot />
	</div>
</main>
