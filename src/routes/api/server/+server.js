import { error } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, setHeaders }) {
	const id = url.searchParams.get('id') ?? -1;

	if (id == -1) {
		throw error(400, 'Missing Query Param: id');
	}

	const res = await prisma.server.findFirst({ where: { id: { equals: id } } });

	if (res == null) {
		throw error(400, 'Server not found with id: ' + id);
	}

	setHeaders({
		'Content-Type': 'application/json'
	});

	return new Response(JSON.stringify(res));
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	try {
		const body = await request.json();

		const res = await prisma.server.findFirst({ where: { name: body.name } });

		if (res === null) {
			const server = await prisma.server.create({ data: { ...body, id: undefined } });

			return new Response(JSON.stringify(server));
		} else {
			return new Response('Already exists', { status: 400 });
		}
	} catch (e) {
		console.log(e);
		return new Response('Ups something went wrong', { status: 400 });
	}
}
