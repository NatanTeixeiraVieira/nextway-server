import { Data } from '@/shared/domain/decorators/data.decorator';
import { DomainEvent } from '@/shared/domain/events/domain-event';

type PaymentFinishedEventProps = {
	payerEmail: string;
	payerName: string;
	payerDocument: string;
};

@Data()
export class PaymentFinishedEvent extends DomainEvent {
	constructor(readonly props: PaymentFinishedEventProps) {
		super();
	}
}
