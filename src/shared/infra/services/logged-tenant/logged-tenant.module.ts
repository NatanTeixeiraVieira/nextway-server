import { Providers } from '@/shared/application/constants/providers';
import { Global, Module } from '@nestjs/common';
import { LoggedTenantNestjsService } from './nestjs/logged-tenant.service';

@Global()
@Module({
	providers: [
		{
			provide: Providers.LOGGED_TENANT_SERVICE,
			useClass: LoggedTenantNestjsService,
		},
	],
	exports: [Providers.LOGGED_TENANT_SERVICE],
})
export class LoggedTenantModule {}
