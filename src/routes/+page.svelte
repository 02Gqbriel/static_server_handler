<script>
	//@ts-nocheck

	/** @type {import('./$types').PageData} */
	export let data = { servers: [] };

	let dropdowns = data.servers.map(() => false);
	let times = data.servers.map((v) => calcTime(v.createdAt));
	let deleteModalOpen = false;
	let modalServerIndex = 0;

	setInterval(() => {
		times = times.map((v, i) => calcTime(data.servers[i].createdAt));
	}, 1000);

	function calcTime(time) {
		var diff = Date.now() - time;

		var daysDifference = Math.floor(diff / 1000 / 60 / 60 / 24);
		diff -= daysDifference * 1000 * 60 * 60 * 24;

		var hoursDifference = Math.floor(diff / 1000 / 60 / 60);
		diff -= hoursDifference * 1000 * 60 * 60;

		var minutesDifference = Math.floor(diff / 1000 / 60);
		diff -= minutesDifference * 1000 * 60;

		var secondsDifference = Math.floor(diff / 1000);

		var leadingZero = (time) => (time < 10 ? '0' + time : time);

		return `${leadingZero(daysDifference)}:${leadingZero(hoursDifference)}:${leadingZero(
			minutesDifference
		)}:${leadingZero(secondsDifference)}`;
	}

	async function deleteServer() {
		const res = await fetch('/api/server?id=' + data.servers[modalServerIndex].id, {
			method: 'DELETE'
		});

		if (!res.ok) {
			return console.log(res);
		}

		deleteModalOpen = false;
		window.location.reload();
	}
</script>

<div class="flex flex-col max-w-screen-md mx-auto w-full">
	{#if data.servers.length > 0}
		{#each data.servers as server, index}
			<a
				href="/server/{server.id}"
				class="flex justify-between items-center ring-offset-2 {dropdowns.includes(true)
					? ''
					: 'active:ring-2'} p-2 my-2 bg-slate-100 rounded-md border-2 border-slate-200 hover:bg-stone-100"
			>
				<p class="group-hover:font-medium">{server.name}</p>

				<a href="javascript:undefined" class="flex items-center gap-2 active:ring-0 cursor-default">
					<span
						class={'w-20 text-sm py-0.5 px-1 font-semibold text-center rounded border-2 ' +
							(server.status == 'OFFLINE' ? 'bg-red-200 border-red-300 text-red-700' : '') +
							(server.status == 'ONLINE' ? 'bg-green-200 border-green-300 text-green-700' : '') +
							(server.status == 'PAUSED' ? 'bg-gray-200 border-gray-300 text-gray-700' : '') +
							(server.status == 'ERROR' ? 'bg-yellow-200 border-yellow-300 text-yellow-700' : '')}
						>{server.status}
					</span>

					<span class="md:block hidden">
						{times[index]}
					</span>

					<a
						href="http://{server.domains[0]}"
						class="group bg-slate-200 p-1 rounded hover:bg-slate-300 md:block hidden"
						title="Visit Server ↗"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5 stroke-slate-700 group-hover:stroke-slate-800"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
							/>
						</svg>
					</a>

					<a
						href="/edit/{server.id}"
						class="group bg-slate-200 p-1 rounded hover:bg-slate-300 md:block hidden"
						title="Edit Server"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5 stroke-slate-700 group-hover:stroke-slate-800"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
							/>
						</svg>
					</a>

					<span
						class="group bg-slate-200 p-1 rounded hover:bg-red-200 cursor-pointer md:block hidden"
						title="Delete Server"
						on:click={() => {
							deleteModalOpen = !deleteModalOpen;
							modalServerIndex = index;
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5 stroke-slate-700 group-hover:stroke-red-700"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
							/>
						</svg>
					</span>

					<div class="relative md:hidden block">
						<span
							class=" bg-slate-200 p-1 rounded cursor-pointer md:hidden block"
							on:click={() => (dropdowns[index] = !dropdowns[index])}
						>
							{#if !dropdowns[index]}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5 fill-slate-700"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
									/>
								</svg>
							{:else}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5 fill-slate-700"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fill-rule="evenodd"
										d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
										clip-rule="evenodd"
									/>
								</svg>
							{/if}
						</span>

						<div
							class="{dropdowns[index]
								? 'flex'
								: 'hidden'} absolute right-0 rounded bg-slate-200 border-2 border-slate-300 p-1 w-max z-20  flex-col"
						>
							<span class="text-center">
								{times[index]}
							</span>

							<a
								href="http://{server.domains[0]}"
								class="group bg-slate-200 p-1 rounded hover:bg-slate-300 flex items-center gap-1"
								title="Visit Server ↗"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5 stroke-slate-700 group-hover:stroke-slate-800"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									stroke-width="2"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
									/>
								</svg>
								<p class="font-normal">Visit Server</p>
							</a>

							<a
								href="/edit/{server.id}"
								class="group bg-slate-200 p-1 rounded hover:bg-slate-300 flex items-center gap-1"
								title="Edit Server"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5 stroke-slate-700 group-hover:stroke-slate-800"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									stroke-width="2"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
									/>
								</svg>

								<p class="font-normal">Edit Server</p>
							</a>

							<span
								class="group bg-slate-200 p-1 rounded hover:bg-red-200 cursor-pointer flex items-center gap-1"
								title="Delete Server"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5 stroke-slate-700 group-hover:stroke-red-700"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									stroke-width="2"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
									/>
								</svg>

								<p class="group-hover:text-red-700 font-normal">Delete Server</p>
							</span>
						</div>
					</div>
				</a>
			</a>
		{/each}

		<div
			class={!dropdowns.includes(true)
				? 'hidden w-0 h-0'
				: 'block w-screen h-screen absolute left-0 top-0 z-10 backdrop-blur-[0.75px] '}
			on:click={() => (dropdowns = dropdowns.map(() => false))}
		/>

		<div
			id="deleteBackdrop"
			class="{deleteModalOpen
				? 'flex'
				: 'hidden'} w-screen h-screen absolute left-0 top-0 backdrop-blur justify-center items-center"
			on:click={(e) => e.target.id === 'deleteBackdrop' && (deleteModalOpen = !deleteModalOpen)}
		>
			<div
				class="flex flex-col justify-between absolute w-[70%] h-[30%] p-5 z-10 bg-slate-50 border-2 border-slate-200 rounded"
			>
				<div>
					<span class=" float-right"
						><svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-28 w-28 stroke-red-500 bg-red-200 rounded-full"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg></span
					>
					<p class="text-2xl p-2">
						Are you sure you want to delete <br /> Server:
						<span class="text-3xl font-semibold">{data.servers[modalServerIndex].name}</span>
					</p>
				</div>

				<p class="mb-16 p-2">Servers that are deleted can not be restored</p>

				<div class="flex justify-evenly">
					<button
						on:click={(e) => (deleteModalOpen = !deleteModalOpen)}
						class="bg-slate-200 border-2 border-transparent hover:border-slate-300  text-slate-600 px-5 py-1 rounded"
						>Return</button
					>
					<button
						on:click={deleteServer}
						class="bg-red-200 text-red-600 border-2 border-transparent hover:border-red-300 px-5 py-1 rounded"
						>Delete</button
					>
				</div>
			</div>
		</div>
	{:else}
		<p>no server existing</p>
	{/if}

	<span>
		<a href="/create">
			<button
				class="float-right w-fit text-sm px-2 py-1 bg-slate-100 border-2 ring-offset-2 active:ring-2 border-slate-200 hover:bg-stone-100 rounded-md"
			>
				add Server
			</button>
		</a>
	</span>
</div>
