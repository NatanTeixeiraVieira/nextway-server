import { Entity } from '@/shared/domain/entities/entity';

export type DeliveryProps = {
	deliveryRadiusKm: number;
	deliveryPrice: number;
};

export type RegisterDeliveryProps = {
	deliveryRadiusKm: number;
	deliveryPrice: number;
};

export class Delivery extends Entity<DeliveryProps> {}
