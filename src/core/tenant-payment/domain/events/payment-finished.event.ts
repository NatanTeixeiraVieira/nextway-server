import { DomainEvent } from '@/shared/domain/events/domain-event';

type PaymentMadeEventProps = {
	nextDueDate: Date;
};

export class PaymentFinishedEvent
	extends DomainEvent
	implements PaymentMadeEventProps
{
	nextDueDate: Date;
}
