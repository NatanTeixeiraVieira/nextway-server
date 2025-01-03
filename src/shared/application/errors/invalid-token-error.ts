export class InvalidTokenError extends Error {
	constructor(readonly message: string) {
		super(message);
		this.name = 'InvalidTokenError';
	}
}
