export abstract class DomainEvent<Props = Record<string, unknown>> {
	protected readonly ocurredAt: Date;

	constructor(props: Props) {
		Object.assign(this, props);
		this.ocurredAt = new Date();
	}
}
