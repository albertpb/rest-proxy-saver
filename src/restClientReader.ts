import fs from 'fs';

export class RestClientReader {
	readResponse(hash: string) {
		const responseFilename = `${process.cwd()}/responses/${hash}.http`;
		const requestFileName = `${process.cwd()}/requests/${hash}.http`;

		const responseFilenameExists = fs.existsSync(responseFilename);
		const requestFilenameExists = fs.existsSync(requestFileName);

		if (responseFilenameExists && requestFilenameExists) {
			const responseContent = fs.readFileSync(responseFilename, {
				encoding: 'utf-8',
			});

			const contentTypeLine = this.readLine(requestFileName, 5);
			const contentType = contentTypeLine.split(':')[1].trim();

			const body = this.parseBody(contentType, responseContent);

			return body;
		}

		return 404;
	}

	readLine(filename: string, lineNo: number) {
		const data = fs.readFileSync(filename, 'utf8');

		const lines = data.split('\n');

		if (+lineNo > lines.length) {
			throw new Error('File end reached without finding line');
		} else {
			return lines[+lineNo];
		}
	}

	parseBody(contentType: string, body: string) {
		switch (contentType) {
			case 'application/json': {
				return JSON.parse(body);
			}

			default: {
				return body;
			}
		}
	}
}
