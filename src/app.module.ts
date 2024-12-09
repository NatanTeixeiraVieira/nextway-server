import { Module } from '@nestjs/common';
import { DatabaseModule } from './shared/infra/database/database.module';
import { EnvConfigModule } from './shared/infra/env-config/env-config.module';

@Module({
	imports: [DatabaseModule, EnvConfigModule],
	controllers: [],
	providers: [],
})
export class AppModule {}
