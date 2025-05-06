import { Data } from '@/shared/domain/decorators/data.decorator';
import { Entity } from '@/shared/domain/entities/entity';
import { EntityValidationError } from '@/shared/domain/errors/validation-error';
import { PaymentFinishedEvent } from '../events/payment-finished.event';
import { TenantPaymentValidatorFactory } from '../validators/tenant-payment.validator';
import { CardProps } from './card.entity';

export enum TenantPaymentStatus {
	PAID = 'PAID',
	PENDING = 'PENDING',
	FAILED = 'FAILED',
	CANCELED = 'CANCELED',
}

export type TenantPaymentProps = {
	tenantId: string;
	price: number;
	currency: string;
	card: CardProps;
	status: TenantPaymentStatus;
	nextDueDate: Date | null;
};

type PayProps = {
	tenantId: string;
	price: number;
	currency: string;
	cardToken: string;
	cardLastDigits: string;
	cardBrand: string;
};

type FinishPaymentProps = {
	payerEmail: string;
	payerName: string;
	payerDocument: string;
	status: TenantPaymentStatus;
};

export interface TenantPayment extends TenantPaymentProps {}

@Data()
export class TenantPayment extends Entity<TenantPaymentProps> {
	static initPayment(payProps: PayProps): TenantPayment {
		const tenantPaymentProps: TenantPaymentProps = {
			tenantId: payProps.tenantId,
			price: payProps.price,
			currency: payProps.currency,
			card: {
				tenantId: payProps.tenantId,
				token: payProps.cardToken,
				lastDigits: payProps.cardLastDigits,
				brand: payProps.cardBrand,
				active: true,
			},
			status: TenantPaymentStatus.PENDING,
			nextDueDate: null,
		};
		TenantPayment.validate(tenantPaymentProps);

		return new TenantPayment(tenantPaymentProps);
	}

	finishPayment(finishPaymentProps: FinishPaymentProps): void {
		const { status, ...finishPaymentPropsRest } = finishPaymentProps;
		TenantPayment.validate({ ...this.props, status });

		const today = new Date();
		const signatureNumberOfMonths = 1;
		const nextMonthDate = new Date(
			today.getFullYear(),
			today.getMonth() + signatureNumberOfMonths,
			today.getDate(),
		);

		this.status = status;
		this.nextDueDate = nextMonthDate;

		const paymentFinishedEvent = new PaymentFinishedEvent(
			finishPaymentPropsRest,
		);
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
