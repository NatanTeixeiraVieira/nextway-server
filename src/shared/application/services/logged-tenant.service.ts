export type LoggedTenant = {
	id: string;
	email: string;
};

export interface LoggedTenantService {
	getLoggedTenant(): LoggedTenant | null;
	setLoggedTenant(loggedTenant: LoggedTenant): void;
}
