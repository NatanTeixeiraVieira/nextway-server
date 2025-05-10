import { Providers } from '@/shared/application/constants/providers';
import { Module } from '@nestjs/common';
import { CardMercadopagoService } from './mercadopago/card-mercadopago.service';

@Module({
	providers: [
		{ provide: Providers.CARD_SERVICE, useClass: CardMercadopagoService },
	],
	exports: [Providers.CARD_SERVICE],
})
export class CardServiceModule {}
