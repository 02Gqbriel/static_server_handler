import { error } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/** @type {import('./$types').RequestHandler} */
export async function GET({ setHeaders }) {
	const res = await prisma.server.findMany();

	if (res == null) {
		throw error(400, 'No Servers existing');
	}

	setHeaders({
		'Content-Type': 'application/json'
	});

	return new Response(JSON.stringify(res));
}
