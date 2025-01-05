export class InvalidCredentialsError extends Error {
	constructor(readonly message: string) {
		super(message);
		this.name = 'InvalidCredentialsError';
	}
}
