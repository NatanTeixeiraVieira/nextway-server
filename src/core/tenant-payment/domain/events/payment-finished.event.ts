import { DomainEvent } from '@/shared/domain/events/domain-event';

type PaymentMadeEventProps = {
	nextDueDate: Date;
	tenantId: string;
};

export class PaymentFinishedEvent
	extends DomainEvent<PaymentMadeEventProps>
	implements PaymentMadeEventProps
{
	tenantId: string;
	nextDueDate: Date;
}
