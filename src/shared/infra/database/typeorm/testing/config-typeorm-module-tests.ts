import { UserSchema } from '@/core/user/infra/database/typeorm/schemas/user.schema';
import { Providers } from '@/shared/application/constants/providers';
import { EnvConfig } from '@/shared/application/env-config/env-config';
import { EnvConfigModule } from '@/shared/infra/env-config/env-config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { setupDatabase } from '../config';

export function configTypeOrmModule() {
	const module = TypeOrmModule.forRootAsync({
		imports: [EnvConfigModule],
		useFactory: async (envConfig: EnvConfig) => {
			return {
				type: 'postgres',
				host: envConfig.getDbHost(),
				port: envConfig.getDbPort(),
				username: envConfig.getDbUsername(),
				password: envConfig.getDbPassword(),
				database: envConfig.getDbName(),
				schema: envConfig.getDbSchema(),
				entities: [UserSchema],
				synchronize: true,
				logging: true,
			};
		},
		inject: [Providers.ENV_CONFIG_SERVICE],

		dataSourceFactory: async (options) => {
			if (!options) {
				throw new Error('Invalid options passed');
			}

			await setupDatabase(options as PostgresConnectionOptions);
			return new DataSource(options);
		},
	});

	return module;
}
