export class InvalidEmailCodeError extends Error {
	constructor(readonly message: string) {
		super(message);
		this.name = 'InvalidEmailCodeError';
	}
}
