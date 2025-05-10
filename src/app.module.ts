import { Module } from '@nestjs/common';
import { TenantPaymentModule } from './core/tenant-payment/infra/tenant-payment.module';
import { TenantModule } from './core/tenant/infra/tenant.module';
import { UserModule } from './core/user/infra/user.module';
import { DatabaseModule } from './shared/infra/database/database.module';
import { EnvConfigModule } from './shared/infra/env-config/env-config.module';
import { AuthServiceModule } from './shared/infra/services/auth-service/auth-service.module';
import { CardServiceModule } from './shared/infra/services/card-service/card-service.module';
import { CnpjServiceModule } from './shared/infra/services/cnpj-service/cnpj-service.module';
import { HashServiceModule } from './shared/infra/services/hash-service/hash-service.module';
import { HttpServiceModule } from './shared/infra/services/http-service/http-service.module';
import { JwtServiceModule } from './shared/infra/services/jwt-service/jwt-service.module';
import { LoggedTenantModule } from './shared/infra/services/logged-tenant/logged-tenant.module';
import { LoggedUserModule } from './shared/infra/services/logged-user/logged-user.module';
import { MailServiceModule } from './shared/infra/services/mail-service/mail-service.module';
import { PlanPaymentServiceModule } from './shared/infra/services/plan-payment-service/plan-payment-service.module';
import { ZipcodeModule } from './shared/infra/services/zipcode-service/zipcode.module';
import { SharedModule } from './shared/infra/shared.module';

@Module({
	imports: [
		CardServiceModule,
		TenantPaymentModule,
		PlanPaymentServiceModule,
		LoggedTenantModule,
		SharedModule,
		TenantModule,
		// FileModule,
		HttpServiceModule,
		CnpjServiceModule,
		ZipcodeModule,
		LoggedUserModule,
		AuthServiceModule,
		MailServiceModule,
		HashServiceModule,
		JwtServiceModule,
		UserModule,
		DatabaseModule,
		EnvConfigModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
