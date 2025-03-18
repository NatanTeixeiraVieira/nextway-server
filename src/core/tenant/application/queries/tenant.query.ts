import { PlanProps } from '../../domain/entities/plan.entity';

type GetWeekdayById = {
	id: string;
	weekdayName: string;
	weekdayShortName: string;
};

export interface TenantQuery {
	emailExists(email: string): Promise<boolean>;
	cnpjExists(cnpf: string): Promise<boolean>;
	slugExists(slug: string): Promise<boolean>;
	getPlan(): Promise<PlanProps & { id: string }>;
	getWeekdayById(id: string): Promise<GetWeekdayById>;
}
