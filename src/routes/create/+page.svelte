<script>
	//@ts-nocheck
	let value = {
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

	let location = {
		pathname: '',
		res_type: 'STATIC',
		res_string: '',
		whitelist: [],
		blacklist: []
	};

	let loading = false;

	function resetLocation() {
		location = {
			pathname: '',
			res_type: 'STATIC',
			res_string: '',
			whitelist: [],
			blacklist: []
		};
	}

	function addDomain() {
		const input = document.querySelector('input#domainInput');

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
		value.domains = value.domains.filter((v) =>
			v !== event.path[1].children[0].textContent ? v : undefined
		);
	}

	function addPre() {
		const input = document.querySelector('input#preInput');

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
			v !== event.path[1].children[0].textContent ? v : undefined
		);
	}

	function addLocation() {
		for (const l of value.locations) {
			if (l.pathname === location.pathname) {
				alert('Pathname already exits');
				resetLocation();
				return;
			}
		}
		value.locations = [...value.locations, location];
		resetLocation();
	}

	function deleteLocation(event) {
		value.locations = value.locations.filter((v) =>
			v.pathname !== event.path[1].children[0].children[0].textContent ? v : undefined
		);
	}

	async function createServer() {
		loading = true;
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

		loading = false;
	}
</script>

<div
	class="max-w-screen-md mx-auto flex flex-col gap-3 p-2 h-fit w-full rounded border-2 border-slate-200 bg-slate-100"
>
	<h1 class="text-lg">Create Server</h1>

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
			rows="1"
			bind:value={value.description}
		/>
	</div>

	<div class="flex flex-col">
		<label for="domainInput" class="text-sm after:content-['*'] after:text-red-500">Domains:</label>

		<div class="grow flex flex-col">
			<span class="flex flex-col" id="domainContainer">
				{#each value.domains as domain}
					<div class="flex items-center justify-between my-1 gap-1">
						<p class="bg-slate-200/30 h-7 grow rounded text-sm font-medium p-1">
							{domain}
						</p>
						<img
							class="block h-7 w-12 p-1 float-right bg-red-200/75 rounded cursor-pointer"
							src="/trash.svg"
							alt=" "
							on:click={deleteDomain}
						/>
					</div>
				{/each}
			</span>

			<div class="flex grow items-center gap-1">
				<input
					id="domainInput"
					placeholder="e.g. gabriel-egli.ch"
					class="grow placeholder:text-xs placeholder:italic placeholder:font-medium placeholder:text-slate-700/50"
					type="text"
					on:keyup={(e) => e.code == 'Enter' && addDomain()}
				/>
				<svg
					on:click={addDomain}
					xmlns="http://www.w3.org/2000/svg"
					class="h-7 w-12 p-1 cursor-pointer bg-slate-200 active:ring-2 rounded ring-offset-2"
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
		</div>
	</div>

	<div class="flex flex-col gap-1">
		<label for="locationInput" class="text-sm after:content-['*'] after:text-red-500"
			>Locations:</label
		>

		<div id="locContainer" class="flex gap-1 flex-col">
			{#each value.locations as loc}
				<div class="flex items-center gap-1">
					<div
						class="flex items-center justify-between text-xs bg-slate-200/30 h-7 grow rounded font-medium p-1 overflow-hidden"
					>
						<span class="max-w-[35%] text-ellipsis overflow-hidden">{loc.pathname}</span>

						<span class="flex items-center justify-center"
							><svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-4 w-4"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
									clip-rule="evenodd"
								/>
							</svg>
							<p class="font-normal italic">
								{loc.res_type == 'PROXY_PASS' ? 'PROXY' : loc.res_type}
							</p>

							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-4 w-4"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
									clip-rule="evenodd"
								/>
							</svg>
						</span>

						<span class="max-w-[35%] text-ellipsis overflow-hidden">{loc.res_string}</span>
					</div>
					<img
						class="block h-7 p-1 bg-red-200/75 rounded cursor-pointer"
						src="/trash.svg"
						alt=" "
						on:click={deleteLocation}
					/>
				</div>
			{/each}
		</div>

		<div class="flex flex-col gap-1">
			<label for="locaPathInput" class="text-xs">Pathname:</label>
			<input
				id="locPathInput"
				placeholder="e.g. /api/server"
				class="grow placeholder:text-xs placeholder:italic placeholder:font-medium placeholder:text-slate-700/50"
				type="text"
				bind:value={location.pathname}
			/>
		</div>
		<div>
			<label for="locResInput" class="text-xs">Response:</label>
			<div class="flex items-center gap-1">
				<div
					class="flex relative gap-2 rounded-md overflow-hidden items-center bg-slate-200 h-full p-1 border-2 border-slate-400"
				>
					<p
						class="text-xs z-20 {location.res_type == 'STATIC'
							? 'text-slate-50 cursor-default'
							: 'cursor-pointer '}"
						on:click={() => {
							location.res_type = 'STATIC';
						}}
					>
						STATIC
					</p>
					<p
						class="text-xs z-20 {location.res_type == 'PROXY_PASS'
							? 'text-slate-50 cursor-default'
							: 'cursor-pointer '}"
						on:click={() => {
							location.res_type = 'PROXY_PASS';
						}}
					>
						PROXY
					</p>

					<div
						class="h-full w-[50%] bg-slate-800 transition-all duration-200 rounded {location.res_type ==
						'PROXY_PASS'
							? 'left-[50%]'
							: 'left-0'} top-0 absolute z-10"
					>
						&zwnj;
					</div>
				</div>

				<input
					id="locResInput"
					placeholder={location.res_type == 'PROXY_PASS'
						? 'e.g. localhost:5000'
						: 'e.g. /home/ubuntu/index.html'}
					class="grow placeholder:text-xs placeholder:italic placeholder:font-medium placeholder:text-slate-700/50"
					type="text"
					bind:value={location.res_string}
				/>
			</div>
		</div>

		<div class="bg-slate-200 active:ring-2 rounded ring-offset-2 flex justify-center w-32 self-end">
			<svg
				on:click={addLocation}
				xmlns="http://www.w3.org/2000/svg"
				class="h-7 w-12 p-1 cursor-pointer grow "
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
	</div>

	<div class="flex flex-col">
		<label for="preInput" class="text-sm">Pre Run Scripts:</label>

		<div class="grow flex flex-col">
			<span class="flex flex-col" id="preContainer">
				{#each value.pre_run_commands as pre_run_commands}
					<div class="flex items-center justify-between my-1 gap-1">
						<p class="bg-slate-200/30 h-7 grow rounded text-sm font-medium p-1">
							{pre_run_commands}
						</p>
						<img
							class="block h-7 w-12 p-1 float-right bg-red-200/75 rounded cursor-pointer"
							src="/trash.svg"
							alt=" "
							on:click={deletePre}
						/>
					</div>
				{/each}
			</span>

			<div class="flex grow items-center gap-1">
				<input
					id="preInput"
					placeholder="e.g. npm install --save"
					class="grow placeholder:text-xs placeholder:italic placeholder:font-medium placeholder:text-slate-700/50"
					type="text"
					on:keyup={(e) => e.code == 'Enter' && addPre()}
				/>
				<svg
					on:click={addPre}
					xmlns="http://www.w3.org/2000/svg"
					class="h-7 w-12 p-1 cursor-pointer  bg-slate-200 active:ring-2 rounded ring-offset-2"
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
		</div>
	</div>

	<div class="flex flex-col gap-1">
		<label for="startInput" class="text-sm after:content-['*'] after:text-red-500"
			>Start Command:</label
		>
		<input
			id="startInput"
			placeholder="e.g. npm run start"
			class="grow placeholder:text-xs placeholder:italic placeholder:font-medium placeholder:text-slate-700/50"
			type="text"
			bind:value={value.start_command}
		/>
	</div>

	<div class="flex flex-col gap-1">
		<label for="gitInput" class="text-sm after:content-['*'] after:text-red-500">Github Link:</label
		>
		<input
			id="gitInput"
			placeholder="e.g. https://github.com/repo.git"
			class="grow placeholder:text-xs placeholder:italic placeholder:font-medium placeholder:text-slate-700/50"
			type="text"
			bind:value={value.github_link}
		/>
	</div>

	<div class="flex items-center gap-2">
		<input id="gzipInput" class="" type="checkbox" on:click={() => (value.gzip = !value.gzip)} />
		<label for="gzipInput" class="text-sm">Gzip Compression</label>
	</div>

	<div class="text-center font-light text-xs -m-2">
		<span class="text-red-500 text-sm">*</span> = Required
	</div>

	<button
		on:click={createServer}
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
		Add Server</button
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
