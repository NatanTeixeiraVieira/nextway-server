import { Module } from '@nestjs/common';
import { UserModule } from './core/user/infra/user.module';
import { DatabaseModule } from './shared/infra/database/database.module';
import { EnvConfigModule } from './shared/infra/env-config/env-config.module';
import { AuthServiceModule } from './shared/infra/services/auth-service/auth-service.module';
import { HashServiceModule } from './shared/infra/services/hash-service/hash-service.module';
import { JwtServiceModule } from './shared/infra/services/jwt-service/jwt-service.module';
import { LoggedUserModule } from './shared/infra/services/logged-user/logged-user.module';
import { MailServiceModule } from './shared/infra/services/mail-service/mail-service.module';

@Module({
	imports: [
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
