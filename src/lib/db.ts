import { readFileSync } from 'fs';
import type Prisma from '@prisma/client';
import type { Server } from '@prisma/client';

function parseConfig(): Prisma.Server[] {
	const config: string = readFileSync('/etc/nginx/sites-enabled/reverse-proxy.conf', {
		encoding: 'utf-8'
	});

	let c = config
		.replaceAll('\t', '')
		.replaceAll(';', '')
		.split('\n')
		.filter((v) => (v !== '\n' ? v : undefined));

	const r = [];

	for (let i = 0; i < c.length; i++) {
		if (c[i].startsWith('server')) {
			const d = new Date();
			d.setMilliseconds(Date.now());

			const s: Prisma.Server = {
				id: '',
				name: '',
				
				description: '',
				createdAt: Date.now(),
				domains: [],
				gzip: false,
				locations: [],
				status: 'OFFLINE',
				pre_run_commands: [],
				start_command: '',
				github_link: ''
			};

			i++;

			if (c[i].includes('$host')) break;

			while (c[i] !== '}') {
				if (c[i].includes('# managed by Certbot')) {
					i++;
					continue;
				}

				let l = c[i].split(' ');

				if (l[0] == 'server_name') {
					for (let j = 1; j < l.length; j++) {
						s.domains.push(l[j]);
					}
				}

				if (l[0] == 'gzip') {
					s.gzip = true;
				}

				if (l[0] == 'location') {
					const loc: Prisma.Location = {
						pathname: l[1],
						res_type: 'STATIC',
						res_string: '',
						whitelist: [],
						blacklist: []
					};

					i++;

					while (c[i] !== '}') {
						const splitL = c[i].split(' ');

						if (splitL[0] == 'proxy_pass') {
							loc.res_type = 'PROXY_PASS';
							loc.res_string = splitL[1];
						}

						if (splitL[0] == 'root') {
							loc.res_type = 'STATIC';
							loc.res_string = splitL[1];
						}

						if (splitL[0] == 'allow') {
							loc.whitelist = splitL.filter((v, i) => (i == 0 ? undefined : v));
						}

						if (splitL[0] == 'deny') {
							loc.blacklist = splitL.filter((v, i) => (i == 0 ? undefined : v));
						}

						i++;
					}

					s.locations.push({ ...loc });
				}

				i++;
			}
			r.push(s);
		}
	}

	return r;
}

function stringifyConfig(config: Server[]): string {
	let string = '';

	config.forEach((v) => {
		string += `${v.}`;
	});

	return string;
}

function readConfigFile(): string {
	return readFileSync('/etc/nginx/sites-enabled/reverse-proxy.conf', {
		encoding: 'utf-8'
	});
}

export { readConfigFile, parseConfig };
