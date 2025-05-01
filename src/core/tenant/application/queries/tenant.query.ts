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
	getWeekdayById(id: string): Promise<GetWeekdayById | null>;
	getInactiveUserIdByEmail(
		email: string,
	): Promise<GetInactiveUserIdByEmail | null>;
}
