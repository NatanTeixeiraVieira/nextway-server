import { CardService } from '@/shared/application/services/card.service';

export class CardMercadopagoService implements CardService {
	mapCardBand(band: string): string {
		const mapper = {
			master: 'Mastercard',
		} as const;

		return mapper[band];
	}
}
