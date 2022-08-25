

/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
	const res = await fetch('/api/server/list');

	const json = await res.json();

	return { servers: json };
}
