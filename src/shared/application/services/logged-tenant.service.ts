export type LoggedTenant = {
	id: string;
};

export interface LoggedTenantService {
	getLoggedTenant(): LoggedTenant | null;
	setLoggedTenant(loggedTenant: LoggedTenant): void;
}
