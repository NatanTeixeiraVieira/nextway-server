import { CityProps } from '../../domain/entities/city.entity';
import { PlanProps } from '../../domain/entities/plan.entity';
import { StateProps } from '../../domain/entities/state.entity';

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
	getOneStateByName(name: string): Promise<StateProps | null>;
	getOneCityByName(name: string): Promise<CityProps | null>;
}
