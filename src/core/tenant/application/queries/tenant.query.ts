import { PlanProps } from '../../domain/entities/plan.entity';

export type GetWeekdayById = {
	id: string;
	weekdayName: string;
	weekdayShortName: string;
};

export interface TenantQuery {
	emailExists(email: string): Promise<boolean>;
	cnpjExists(cnpj: string): Promise<boolean>;
	slugExists(slug: string): Promise<boolean>;
	getPlan(): Promise<PlanProps & { id: string }>;
	getWeekdayById(id: string): Promise<GetWeekdayById | null>;
}
