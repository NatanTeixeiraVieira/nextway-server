import { Module } from '@nestjs/common';
import { UserModule } from './core/user/infra/user.module';
import { DatabaseModule } from './shared/infra/database/database.module';
import { EnvConfigModule } from './shared/infra/env-config/env-config.module';
import { JwtServiceModule } from './shared/infra/services/jwt-service/jwt-service.module';

@Module({
	imports: [JwtServiceModule, UserModule, DatabaseModule, EnvConfigModule],
	controllers: [],
	providers: [],
})
export class AppModule {}
