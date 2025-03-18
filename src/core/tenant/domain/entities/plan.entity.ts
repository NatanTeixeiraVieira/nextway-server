import { Entity } from '@/shared/domain/entities/entity';

export type PlanProps = {
	name: string;
	price: string;
};

export type RegisterTenantPlanProps = {
	id: string;
	name: string;
	price: string;
};

export class Plan extends Entity<PlanProps> {}
