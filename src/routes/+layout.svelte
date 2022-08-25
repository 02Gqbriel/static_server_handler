<script>
	import '$lib/app.css';
	import { browser, dev } from '$app/env';
</script>

<svelte:head>
	{#if !dev && browser}
		<link rel="manifest" href="/manifest.webmanifest" />
		<script src="/registerSW.js"></script>

		<style>
			{async () => {return await import '$lib/app.css'}}
		</style>
	{/if}
</svelte:head>

<header class="max-w-screen-md mx-auto w-full">
	<h1 class="text-lg m-2"><a href="/">Admin Configuration</a></h1>
</header>

<main class="grow flex flex-col p-2">
	<slot />
</main>

<footer class="text-center text-sm italic text-slate-700 select-none">
	@copyright Gabriel Egli
</footer>
