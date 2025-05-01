import { CityProps } from '../../domain/entities/city.entity';

export type GetWeekdayById = {
	id: string;
	weekdayName: string;
	weekdayShortName: string;
};

export type GetInactiveUserIdByEmail = {
	id: string;
};

export interface TenantQuery {
	isEmailVerified(email: string): Promise<boolean>;
	cnpjExists(cnpj: string): Promise<boolean>;
	slugExists(slug: string): Promise<boolean>;
	// getPlan(): Promise<PlanProps & { id: string }>;
	getWeekdayById(id: string): Promise<GetWeekdayById | null>;
	// getOneStateByName(name: string): Promise<StateProps | null>;
	getOneCityByName(name: string): Promise<CityProps | null>;
	getInactiveUserIdByEmail(
		email: string,
	): Promise<GetInactiveUserIdByEmail | null>;
}
