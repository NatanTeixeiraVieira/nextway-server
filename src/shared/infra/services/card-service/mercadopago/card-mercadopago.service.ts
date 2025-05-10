import { CardService } from '@/shared/application/services/card.service';

export class CardMercadopagoService implements CardService {
	mapCardBand(band: string): string {
		throw new Error('Method not implemented.');
	}
}
