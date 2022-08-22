<script>
	/** @type {import('./$types').PageData} */
	export let data;

	const {
		createdAt,
		description,
		domains,
		github_link,
		gzip,
		id,
		locations,
		name,
		pre_run_commands,
		start_command,
		status
	} = data.server;

	let timeActive = refresh();

	function refresh() {
		var diff = Date.now() - createdAt;

		var daysDifference = Math.floor(diff / 1000 / 60 / 60 / 24);
		diff -= daysDifference * 1000 * 60 * 60 * 24;

		var hoursDifference = Math.floor(diff / 1000 / 60 / 60);
		diff -= hoursDifference * 1000 * 60 * 60;

		var minutesDifference = Math.floor(diff / 1000 / 60);
		diff -= minutesDifference * 1000 * 60;

		var secondsDifference = Math.floor(diff / 1000);
		//@ts-ignore
		var leadingZero = (time) => (time < 10 ? '0' + time : time);

		return `${leadingZero(daysDifference)}:${leadingZero(hoursDifference)}:${leadingZero(
			minutesDifference
		)}:${leadingZero(secondsDifference)}`;
	}
</script>

<div
	class="max-w-screen-md mx-auto w-full h-fit rounded border-2 p-2 shadow-sm border-slate-200 flex flex-col bg-slate-100 gap-y-5"
>
	<div>
		<div class="float-right flex flex-col justify-center items-end gap-1">
			<p class=" flex items-center gap-1 ">
				{timeActive}
				<svg
					on:click={() => {
						timeActive = refresh();
					}}
					xmlns="http://www.w3.org/2000/svg"
					class="h-7 w-7 fill-slate-700 cursor-pointer border-2 rounded ring-offset-2 active:ring-2 bg-slate-200 hover:bg-slate-300 hover:border-slate-300"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
						clip-rule="evenodd"
					/>
				</svg>
			</p>
			<span
				class={'w-20 text-sm py-1 px-2 font-semibold text-center rounded border ' +
					(status == 'OFFLINE' ? 'bg-red-200 border-red-300 text-red-700' : '') +
					(status == 'ONLINE' ? 'bg-green-200 border-green-300 text-green-700' : '') +
					(status == 'PAUSED' ? 'bg-gray-200 border-gray-300 text-gray-700' : '') +
					(status == 'ERROR' ? 'bg-yellow-200 border-yellow-300 text-yellow-700' : '')}
				>{status}
			</span>
		</div>

		<p class="text-sm font-light mt-2">
			Server: <span class="text-xl font-medium capitalize">{name}</span>
		</p>
	</div>

	<p class="">{description}</p>

	<div class="flex">
		<p class="mr-2">Domain:</p>
		<div class="flex">
			{#each domains as domain}
				<a href="http://{domain}" class="mx-1 px-2 flex items-center bg-slate-200 rounded">
					{domain}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5 pl-1 bg-slate-200 stroke-slate-700"
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
			{/each}
		</div>
	</div>

	<div class="flex ">
		<p class="mr-2">Github:</p>
		<a href={github_link}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5 bg-slate-200 stroke-slate-700"
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
	</div>

	<div class="flex">
		<p class="mr-2">Pre Run Script:</p>
		<div class="flex">
			{#each pre_run_commands as command}
				<p class="mx-1 px-2 bg-slate-200 rounded">{command}</p>
			{/each}
		</div>
	</div>

	<div class="flex ">
		<p class="mr-2">Start Command:</p>
		<p>{start_command}</p>
	</div>
</div>
