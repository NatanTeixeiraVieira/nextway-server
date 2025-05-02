import {
	LoggedTenant,
	LoggedTenantService,
} from '@/shared/application/services/logged-tenant.service';
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class LoggedTenantNestjsService implements LoggedTenantService {
	private loggedTenant: LoggedTenant;

	getLoggedTenant(): LoggedTenant {
		return this.loggedTenant;
	}

	setLoggedTenant(loggedTenant: LoggedTenant) {
		this.loggedTenant = loggedTenant;
	}
}
