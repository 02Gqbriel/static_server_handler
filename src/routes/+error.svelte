<script>
	// @ts-nocheck

	import { page } from '$app/stores';
</script>

<div class="mx-auto grow flex justify-center items-center flex-col">
	<h1 class=" bg-red-200 flex justify-center items-center text-red-600 p-2 rounded-sm w-fit">
		<span class="font-bold text-red-600 text-8xl mr-1">{$page.status}</span>
		{$page.error.message}
	</h1>

	<button
		on:click={() => window.history.back()}
		class="flex items-center m-2 px-6 py-1 rounded hover:border-slate-300 border-2 ring-offset-2 active:ring-2 bg-slate-200"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="w-7 fill-slate-600"
			viewBox="0 0 20 20"
			fill="currentColor"
		>
			<path
				fill-rule="evenodd"
				d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
				clip-rule="evenodd"
			/>
		</svg>
	</button>
</div>
