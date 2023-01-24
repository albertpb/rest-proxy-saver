export interface RequestPayload {
	path: string;
	method: string;
	headers: Record<string, unknown>;
	body: string;
}

export interface Saver {
	getHash(requestPayload: RequestPayload): string;
	saveRequest(targetURL: string, requestPayload: RequestPayload): string;
	saveResponse(hash: string, response: unknown): void;
}
