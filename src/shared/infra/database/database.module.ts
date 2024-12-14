import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import {
	connectionSource,
	dataSourceOptions,
	setupDatabase,
} from './typeorm/config';

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			useFactory: async () => dataSourceOptions,

			async dataSourceFactory(options) {
				if (!options) {
					throw new Error('Invalid options passed');
				}

				await setupDatabase(options as PostgresConnectionOptions);

				return addTransactionalDataSource(connectionSource);
			},
		}),
	],
	controllers: [],
	providers: [],
})
export class DatabaseModule {}
