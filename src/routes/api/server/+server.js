import { error } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import { spawnSync, spawn } from 'child_process';
import {writeFileSync} from "fs"
import { stringifyConfig } from '$lib/db';

const prisma = new PrismaClient();

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, setHeaders }) {
	const id = url.searchParams.get('id') ?? -1;

	if (id == -1) {
		throw error(400, 'Missing Query Param: id');
	}

	// PM2 integration

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
			let server = await prisma.server.create({ data: { ...body, id: undefined } });

			// clone git
			const s = server.github_link.split('/');

			server = await prisma.server.update({ where: { id: server.id }, data: { status: 'ONLINE' } });

			const config = stringifyConfig(await prisma.server.findMany());

			const t1 = spawnSync(
				[
					'cd /home/ubuntu/servers',
					`git clone ${server.github_link}`,
					`cd ${s[s.length - 1].replace('.git', '')}`,
					...server.pre_run_commands,
					`pm2 start "${server.start_command}" --name ${server.id}\n`
				].join('\n'),
				{ shell: true }
			);

			console.log(t1.stdout.toString())

			writeFileSync('/etc/nginx/sites-available/reverse-proxy.conf', config, { encoding: 'utf-8' });

			const t2 = spawnSync('sudo systemctl restart nginx\n', { shell: true });

			console.log(t2.stdout.toString())

			/** 

			const spawnedShell = spawn('/bin/sh');
			// Capture stdout
			spawnedShell.stdout.on('data', (d) => console.log('DATA', d.toString()));

			spawnedShell.stdout.on('error', (err) => console.log('ERROR', err));

			spawnedShell.stdin.write('cd /home/ubuntu/servers\n');

			spawnedShell.stdin.write(`git clone ${server.github_link}\n`);

			spawnedShell.stdin.write(`cd ${s[s.length - 1].replace('.git', '')}\n`);

			for (const pre_run_command of server.pre_run_commands) {
				spawnedShell.stdin.write(`${pre_run_command}\n`);
			}


			spawnedShell.stdin.write(`pm2 start "${server.start_command}" --name ${server.id}\n`, ()=> {});
			// End

			
			const statusCmd = JSON.parse(spawnSync('pm2', ['jlist']).stdout.toString()).map(
				(v) =>
					v.name === server.id && {
						name: v.name,
						pm_id: v.pm_id,
						status: v.pm2_env.status,
						exit_code: v.pm2_env.exit_code
					}
			);

			console.log(statusCmd)
			
			const status = () => {
				if (statusCmd[0].status == "online") return "ONLINE";
				if (statusCmd[0].status == "errored") return "ERROR";
				if (statusCmd[0].status == "stopped") return "OFFLINE";
			}
			

			spawnedShell.stdin.write(`nginx -t\n`);

			spawnedShell.stdin.end();

			spawnedShell.kill();
			*/

			return new Response(JSON.stringify(server));
		} else {
			return new Response('Already exists', { status: 400 });
		}
	} catch (e) {
		console.log(e);
		return new Response('Ups something went wrong', { status: 400 });
	}
}

/** @type {import('./$types').RequestHandler} */
export async function PUT({ request }) {
	try {
		const body = await request.json();

		const server = await prisma.server.update({
			where: { id: body.id },
			data: { ...body, id: undefined }
		});

		


		return new Response(JSON.stringify(server));
	} catch (e) {
		console.log(e);
		return new Response('Ups something went wrong', { status: 400 });
	}
}

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ url }) {
	try {
		const id = url.searchParams.get('id') ?? -1;

		if (id == -1) return new Response('Missing Query Param: id', { status: 400 });

		const server = await prisma.server.delete({ where: { id: id } });

		const s = server.github_link.split('/');

		const t1 = spawnSync(
			[
				'pm2 delete ' + server.id,
				`cd /home/ubuntu/servers/`,
				`sudo rm -r ${s[s.length - 1].replace('.git', '')}\n`,
			].join('\n'),
			{ shell: true }
		);

		console.log(t1.stdout.toString());

		return new Response(JSON.stringify(server));
	} catch (e) {
		console.log(e);
		return new Response('Ups something went wrong', { status: 400 });
	}
}
