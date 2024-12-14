import { ConfigService, registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { EnvConfigService } from '../../env-config/env-config.service';

const envConfig = new EnvConfigService(new ConfigService());

export const dataSourceOptions: DataSourceOptions = {
	type: 'postgres',
	host: envConfig.getDbHost(),
	port: envConfig.getDbPort(),
	username: envConfig.getDbUsername(),
	password: envConfig.getDbPassword(),
	database: envConfig.getDbName(),
	schema: envConfig.getDbSchema(),
	entities: [],
	migrations: [`${__dirname}/migrations/*.ts`],
	synchronize: false,
};

export default registerAs('typeorm', () => dataSourceOptions);
export const connectionSource = new DataSource(dataSourceOptions);
