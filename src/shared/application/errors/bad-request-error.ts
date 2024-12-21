export class BadRequestError extends Error {
	constructor(readonly message: string) {
		super(message);
		this.name = 'BadRequestError';
	}
}
