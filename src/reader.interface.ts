export interface Reader {
	readResponse(hash: string): unknown;
}
