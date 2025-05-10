export class InternalServerError extends Error {
	constructor(readonly message: string) {
		super(message);
		this.name = 'InternalServerError';
	}
}
