<script lang="ts">
	import type { Server } from '@prisma/client';
	import {} from '@sveltejs/kit';

	let value: Server = {
		id: '',
		name: '',
		description: '',
		createdAt: 0,
		domains: [],
		gzip: false,
		locations: [],
		status: 'OFFLINE',
		pre_run_commands: [],
		start_command: '',
		github_link: ''
	};
	$: value.domains = [];

	function addDomain() {
		const input = document.querySelector<HTMLInputElement>('input#domainInput');

		if (input != null) {
			const v = input.value;

			if (v == null || v.length == 0) {
				alert('value is empty! try again');
				return;
			}

			value.domains = [...value.domains, v];
			input.value = '';
		}
	}

	function deleteDomain(event) {
		value.domains = value.domains.filter((v) => (v === event.target.textContent ? v : undefined));
	}

	function addPre() {
		const input = document.querySelector<HTMLInputElement>('input#preInput');

		if (input != null) {
			const v = input.value;

			if (v == null || v.length == 0) {
				alert('value is empty! try again');
				return;
			}

			value.pre_run_commands = [...value.pre_run_commands, v];
			input.value = '';
		}
	}

	function deletePre(event) {
		value.pre_run_commands = value.pre_run_commands.filter((v) =>
			v === event.target.textContent ? v : undefined
		);
	}

	async function createServer() {
		value.createdAt = Date.now();

		const res = await fetch('/api/server', {
			body: JSON.stringify(value),
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (res.ok) {
			window.location.reload();
		} else {
			alert(await res.text());
		}
	}
</script>

<div class="max-w-screen-sm mx-auto grow space-y-2 mt-20">
	<h1 class="text-lg">Create Server</h1>

	<div class="flex items-center">
		<label for="nameInput" class="w-32 after:content-['*'] after:text-red-500">Name:</label>
		<input id="nameInput" class="ml-5 grow" type="text" bind:value={value.name} />
	</div>

	<div class="flex items-center">
		<label for="descInput" class="w-32 after:content-['*'] after:text-red-500">Description:</label>
		<textarea
			name="descInput"
			id="descInput"
			class="ml-5 grow"
			rows="5"
			bind:value={value.description}
		/>
	</div>

	<div class="flex items-center">
		<label for="domainInput" class="w-32 after:content-['*'] after:text-red-500">Domains:</label>
		<span class="flex ml-5" id="domainContainer">
			{#each value.domains as domain}
				<p
					on:click={deleteDomain}
					class="group cursor-pointer hover:bg-red-300/50 hover:text-red-700 p-2 rounded text-xs font-medium"
				>
					{domain}<img
						class="group-hover:block w-4 h-4 float-right hidden"
						src="/trash.svg"
						alt=" "
					/>
				</p>
			{/each}
		</span>
		<input id="domainInput" class="ml-5 -mr-3 grow" type="text" />
		<svg
			on:click={addDomain}
			xmlns="http://www.w3.org/2000/svg"
			class="h-5 w-5 mr-3 -ml-5 cursor-pointer active:bg-zinc-100 active:ring-2 rounded ring-zinc-300"
			viewBox="0 0 20 20"
			fill="currentColor"
		>
			<path
				fill-rule="evenodd"
				d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
				clip-rule="evenodd"
			/>
		</svg>
	</div>

	<div class="flex items-center">
		<label for="gzipInput" class="w-32 after:content-['*'] after:text-red-500">Gzip:</label>
		<input
			id="gzipInput"
			class="ml-5 "
			type="checkbox"
			on:click={() => (value.gzip = !value.gzip)}
		/>
	</div>

	<div class="flex items-center">
		<label for="locationInput" class="w-32 after:content-['*'] after:text-red-500">Locations:</label
		>
	</div>

	<div class="flex items-center">
		<label for="preInput" class="w-32 after:content-['*'] after:text-red-500"
			>Pre Run Scripts:</label
		>
		<span class="flex ml-5" id="preContainer">
			{#each value.pre_run_commands as pre_run_commands}
				<p
					on:click={deletePre}
					class="group cursor-pointer hover:bg-red-300/50 hover:text-red-700 p-2 rounded text-xs font-medium"
				>
					{pre_run_commands}<img
						class="group-hover:block w-4 h-4 float-right hidden"
						src="/trash.svg"
						alt=" "
					/>
				</p>
			{/each}
		</span>
		<input id="preInput" class="ml-5 -mr-3 grow" type="text" />
		<svg
			on:click={addPre}
			xmlns="http://www.w3.org/2000/svg"
			class="h-5 w-5 mr-3 -ml-5 cursor-pointer active:bg-zinc-100 active:ring-2 rounded ring-zinc-300"
			viewBox="0 0 20 20"
			fill="currentColor"
		>
			<path
				fill-rule="evenodd"
				d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
				clip-rule="evenodd"
			/>
		</svg>
	</div>

	<div class="flex items-center">
		<label for="startInput" class="w-32 after:content-['*'] after:text-red-500"
			>Start Command:</label
		>
		<input id="startInput" class="ml-5 grow" type="text" bind:value={value.start_command} />
	</div>

	<div class="flex items-center">
		<label for="gitInput" class="w-32 after:content-['*'] after:text-red-500">Github Link:</label>
		<input id="gitInput" class="ml-5 grow" type="text" bind:value={value.github_link} />
	</div>

	<button
		on:click={createServer}
		class="bg-zinc-100 active:ring-2 ring-offset-2 border-2 border-white box-border py-1 px-3 rounded float-right m-2 mr-0 hover:border-zinc-300"
		>Add Server</button
	>
</div>
