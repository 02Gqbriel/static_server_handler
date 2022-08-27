<script>
	/** @type {import('./$types').PageData} */
	export let data;

	let value = {
		...data.server
	};

	let loading = false;

	async function editServer() {
		loading = true;
		value.createdAt = Date.now();

		const res = await fetch('/api/server', {
			body: JSON.stringify(value),
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (res.ok) {
			window.history.back();
		} else {
			alert(await res.text());
		}

		loading = false;
	}
</script>

<div
	class="max-w-screen-md mx-auto flex flex-col gap-3 p-2 h-fit w-full rounded border-2 border-slate-200 bg-slate-100"
>
	<h1 class="text-lg">Edit Server</h1>

	<div class="flex flex-col gap-1">
		<label for="nameInput" class="text-sm after:content-['*'] after:text-red-500">Name:</label>
		<input id="nameInput" class="grow" type="text" bind:value={value.name} />
	</div>

	<div class="flex flex-col gap-1">
		<label for="descInput" class="text-sm">Description:</label>
		<textarea
			name="descInput"
			id="descInput"
			class="grow"
			rows="3"
			bind:value={value.description}
		/>
	</div>

	<div class="text-center font-light text-xs -m-2">
		<span class="text-red-500 text-sm">*</span> = Required
	</div>

	<button
		on:click={editServer}
		class="bg-slate-200 active:ring-2 flex items-center justify-center ring-offset-2 border-2 border-slate-300 box-border py-1 px-3 rounded float-right my-2 hover:bg-slate-300"
	>
		{#if loading}
			<svg
				class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
			>
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				/>
			</svg>
		{/if}
		Edit Server</button
	>
</div>

<style>
	input,
	textarea {
		@apply p-1 rounded text-sm ring-slate-500 text-slate-500;
	}

	textarea:focus,
	input:focus {
		@apply ring-slate-500 border-slate-500 font-semibold;
	}

	input[type='checkbox'] {
		@apply h-5 w-5;
	}

	input {
		@apply h-7 text-slate-500;
	}
</style>
