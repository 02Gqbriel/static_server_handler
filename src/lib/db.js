
import Prisma from '@prisma/client';

/** 
 * @param {string} config
 * @return {Prisma.Server[]}
 */
function parseConfig(config){
	console.log("hello")

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

			/** @type {Prisma.Server} */
			const s = {
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
				github_link: "",
			};

			i++;

			if (c[i].includes('$host')) break;

			while (!c[i].includes("}")) {

				if (c[i].startsWith('#id')) {
					
					s.id = c[i].split(' ')[1];
					
				}
		
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
					/** @type {Prisma.Location} */
					const loc = {
						pathname: l[1],
						res_type: 'STATIC',
						res_string: '',
						whitelist: [],
						blacklist: []
					};

					i++;

					while (!c[i].includes('}')) {
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

/** 
 * @param {Prisma.Server[]} config
 * @return {string}
 */
function stringifyConfig(config) {
	let string = '';

	config.forEach((v) => {
		string += `server {\n\tlisten 80;\n`;

		string += "\t#id " + v.id + "\n";

		string += "\tserver_name " + v.domains.join(" ") + ";\n"

		if (v.gzip) string += "\tgzip on;\n"

		v.locations.forEach((l) => {
			string += "\tlocation " + l.pathname + " {\n";
			
			string += "\t\t" + (l.res_type == "PROXY_PASS" ? "proxy_pass" : "root") + l.res_string + ";\n"
			
			string += "\t}\n"
		})

		string+= "} \n\n"
	});

	return string;
}



/** @return {string} */
function readConfigFile() {
	return readFileSync('/etc/nginx/sites-enabled/reverse-proxy.conf', {
		encoding: 'utf-8'
	});
}

export { readConfigFile,parseConfig, stringifyConfig };
