import { CardService } from '@/shared/application/services/card.service';
import { PlanPaymentService } from '@/shared/application/services/plan-payment.service';
import { UseCase } from '@/shared/application/usecases/use-case';
import { TenantPaymentOutput } from '../outputs/tenant-payment-output';

export type Input = {
	// tenantId: string;
	// price: string;
	// currency: string;
	cardToken: string;
	cardLastDigits: string;
	cardBrand: string;
};

export type Output = TenantPaymentOutput;

export class InitTenantPaymentUseCase implements UseCase<Input, Output> {
	constructor(
		private readonly planPaymentService: PlanPaymentService,
		private readonly cardService: CardService,
	) {}

	async execute(input: Input): Promise<TenantPaymentOutput> {
		throw new Error('Method not implemented');
		// const cardBrand = this.cardService.mapCardBand(input.cardBrand);
		// const tenantPayment = TenantPayment.initPayment({
		// 	cardBrand,
		// 	cardLastDigits: input.cardLastDigits,
		// 	cardToken: input.cardToken,
		// 	currency: 'BRL',
		//   price:
		// });
	}
}
