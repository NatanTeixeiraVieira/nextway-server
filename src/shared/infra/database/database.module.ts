import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvConfig } from 'src/shared/application/env-config/env-config';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { EnvConfigModule } from '../env-config/env-config.module';
import { EnvConfigService } from '../env-config/env-config.service';

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			imports: [EnvConfigModule],
			useFactory: async (configService: EnvConfig) => ({
				type: 'postgres',
				host: configService.getDbHost(),
				port: configService.getDbPort(),
				username: configService.getDbUsername(),
				password: configService.getDbPassword(),
				database: configService.getDbName(),
				entities: [],
				schema: configService.getDbSchema(),
				migrations: [`${__dirname}/migrations/{.ts,*.js}`],
				migrationsRun: configService.getMigrationRun(),
				synchronize: false,
				logging: configService.getDbLogs(),
			}),
			async dataSourceFactory(options) {
				if (!options) {
					throw new Error('Invalid options passed');
				}

				return addTransactionalDataSource(new DataSource(options));
			},
			inject: [EnvConfigService],
		}),
	],
	controllers: [],
	providers: [],
})
export class DatabaseModule {}
