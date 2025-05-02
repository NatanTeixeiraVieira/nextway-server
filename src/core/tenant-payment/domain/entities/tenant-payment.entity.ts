import { Data } from '@/shared/domain/decorators/data.decorator';
import { Entity } from '@/shared/domain/entities/entity';
import { CardProps } from './card.entity';

export enum TenantPaymentStatus {
	PAID = 'PAID',
	PENDING = 'PENDING',
	FAILED = 'FAILED',
	CANCELED = 'CANCELED',
}

type TenantPaymentProps = {
	tenantId: string;
	price: number;
	currency: string;
	card: CardProps;
	status: TenantPaymentStatus;
	nextDueDate: Date;
};

type PayProps = {
	tenantId: string;
	price: number;
	currency: string;
	cardToken: string;
	cardLastDigits: string;
	cardBrand: string;
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
			nextDueDate: new Date(),
		};
		TenantPayment.validate(tenantPaymentProps);

		return new TenantPayment(tenantPaymentProps);
	}

	finishPayment(status: TenantPaymentStatus): void {
		TenantPayment.validate({ ...this.props, status });
		this.status = status;
	}

	private static validate(props: TenantPaymentProps) {
		// const tenantPaymentValidatorFactory = new TenantPaymentValidatorFactory();
		// const validator = tenantPaymentValidatorFactory.create();
		// const isValid = validator.validate(props);
		// if (!isValid) {
		//   throw new EntityValidationError(validator.errors);
		// }
	}
}
