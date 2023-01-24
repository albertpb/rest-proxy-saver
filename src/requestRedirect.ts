import { RequestPayload } from './saver.interface';
import request from 'request';
import { Service } from 'typedi';

@Service()
export class RequestRedirect {
	makeRequest(
		targetURL: string,
		requestPayload: RequestPayload
	): Promise<{
		response: request.Response;
		body: string | Record<string, unknown>;
	}> {
		return new Promise((resolve, reject) => {
			request(
				{
					url: `${targetURL}${requestPayload.path}`,
					method: requestPayload.method,
					headers: requestPayload.headers,
					body: this.serializeBody(requestPayload.body),
				},
				(error, response, body) => {
					if (error) {
						reject(error);
					}
					resolve({
						response,
						body: this.parseBodyResponse(
							response.headers['content-type'] || 'text/plain',
							body || ''
						),
					});
				}
			);
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

	parseBodyResponse(
		contentType: string,
		body: string
	): string | Record<string, unknown> {
		if (contentType.includes('application/json')) {
			return JSON.parse(body);
		}

		return body;
	}
}
