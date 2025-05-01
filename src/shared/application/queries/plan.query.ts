import { PlanProps } from '@/shared/domain/entities/plan.entity';

export interface PlanQuery {
	getPlan(): Promise<PlanProps & { id: string }>;
}
