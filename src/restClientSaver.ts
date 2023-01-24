import fs from 'fs';
import { RequestPayload, Saver } from './saver.interface';
import { getSHA256ofJSON } from './hash';

export class RestClientSaver implements Saver {
	constructor() {
		this.createDirectory();
	}

	createDirectory() {
		fs.mkdirSync(`${process.cwd()}/requests`, { recursive: true });
		fs.mkdirSync(`${process.cwd()}/responses`, { recursive: true });
	}

	getHash(requestPayload: RequestPayload): string {
		return getSHA256ofJSON(requestPayload);
	}

	saveRequest(targetURL: string, requestPayload: RequestPayload): string {
		const hash = this.getHash(requestPayload);
		const filename = `${process.cwd()}/requests/${hash}.http`;

		const method = requestPayload.method.toUpperCase();

		const headers = Object.entries(requestPayload.headers).reduce(
			(acc, [key, value]) => {
				return `${acc}${key}: ${value} \n`;
			},
			''
		);

		const body = this.serializeBody(requestPayload.body);

		fs.writeFileSync(filename, `@baseUrl = ${targetURL} \n`, {
			encoding: 'utf-8',
		});

		fs.appendFileSync(filename, `${method} {{baseUrl}} HTTP/1.1 \n`);
		fs.appendFileSync(filename, '\n');
		fs.appendFileSync(filename, `### \n`);
		fs.appendFileSync(filename, '\n');
		fs.appendFileSync(filename, `${headers}\n`);

		fs.appendFileSync(filename, '\n');
		fs.appendFileSync(filename, `${body}`);

		return hash;
	}

	saveResponse(hash: string, response: unknown) {
		const filename = `${process.cwd()}/responses/${hash}.http`;

		const body = this.serializeBody(response);

		fs.writeFileSync(filename, `${body}`, {
			encoding: 'utf-8',
		});
	}

	serializeBody(body: unknown) {
		if (typeof body === 'string') {
			return body;
		}

		if (typeof body === 'object') {
			return JSON.stringify(body, null, 2);
		}
	}
}
