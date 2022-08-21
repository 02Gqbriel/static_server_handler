import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ params, fetch }) {
	const res = await fetch('/api/server?id=' + params.id);

	if (!res.ok) throw error(404, 'not found');

	const data = await res.json();

	return { server: data };
}
