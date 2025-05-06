export abstract class DomainEvent {
	protected readonly ocurredAt: Date;

	constructor() {
		this.ocurredAt = new Date();
	}
}
