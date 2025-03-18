export class ConflictError extends Error {
	constructor(readonly message: string) {
		super(message);
		this.name = 'ConflictError';
	}
}
