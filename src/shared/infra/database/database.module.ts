import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { connectionSource, dataSourceOptions } from './typeorm/config';

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			useFactory: async () => dataSourceOptions,

			async dataSourceFactory(options) {
				if (!options) {
					throw new Error('Invalid options passed');
				}

				return addTransactionalDataSource(connectionSource);
			},
		}),
	],
	controllers: [],
	providers: [],
})
export class DatabaseModule {}
