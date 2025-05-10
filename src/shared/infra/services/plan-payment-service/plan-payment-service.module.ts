import { Providers } from '@/shared/application/constants/providers';
import { Module } from '@nestjs/common';
import { PlanPaymentMercadopagoService } from './mercadopago/plan-payment-mercadopago.service';

@Module({
	providers: [
		{
			provide: Providers.PLAN_PAYMENT_SERVICE,
			useClass: PlanPaymentMercadopagoService,
		},
	],
	exports: [Providers.PLAN_PAYMENT_SERVICE],
})
export class PlanPaymentServiceModule {}
