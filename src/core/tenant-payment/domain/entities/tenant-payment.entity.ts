import { Data } from '@/shared/domain/decorators/data.decorator';
import { Entity } from '@/shared/domain/entities/entity';
import { EntityValidationError } from '@/shared/domain/errors/validation-error';
import { PaymentFinishedEvent } from '../events/payment-finished.event';
import { TenantPaymentValidatorFactory } from '../validators/tenant-payment.validator';

export type TenantPaymentStatus = 'PAID' | 'PENDING' | 'FAILED' | 'CANCELED';

export type TenantPaymentProps = {
	tenantId: string;
	price: number;
	currency: string;
	status: TenantPaymentStatus;
	nextDueDate: Date | null;
};

export type FinishPaymentProps = {
	status: TenantPaymentStatus;
	nextDueDate: Date;
};

export type InitPaymentProps = {
	price: number;
	tenantId: string;
};

export interface TenantPayment extends TenantPaymentProps {}

@Data()
export class TenantPayment extends Entity<TenantPaymentProps> {
	static initPayment(initPaymentProps: InitPaymentProps): TenantPayment {
		const tenantPaymentProps: TenantPaymentProps = {
			currency: 'BRL',
			price: initPaymentProps.price,
			status: 'PENDING',
			tenantId: initPaymentProps.tenantId,
			nextDueDate: null,
		};

		TenantPayment.validate(tenantPaymentProps);

		const tenantPayment = new TenantPayment(tenantPaymentProps);
		return tenantPayment;
	}

	finishPayment(payProps: FinishPaymentProps): void {
		TenantPayment.validate({ ...this.props, ...payProps });

		this.nextDueDate = payProps.nextDueDate;
		this.status = payProps.status;
		this.updateTimestamp();

		const paymentFinishedEvent = new PaymentFinishedEvent({
			nextDueDate: payProps.nextDueDate,
		});

		this.addDomainEvent(paymentFinishedEvent);
	}

	private static validate(props: TenantPaymentProps) {
		const tenantPaymentValidatorFactory = new TenantPaymentValidatorFactory();
		const validator = tenantPaymentValidatorFactory.create();
		const isValid = validator.validate(props);
		if (!isValid) {
			throw new EntityValidationError(validator.errors);
		}
	}
}
