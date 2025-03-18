import { Audit } from '@/shared/domain/entities/entity';

export type DeliveryOutput = {
	id: string;
	deliveryRadiusKm: number;
	deliveryPrice: number;
	audit: Audit;
};
