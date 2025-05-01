import { EnvConfigService } from '@/shared/infra/env-config/env-config.service';
import { ConfigService, registerAs } from '@nestjs/config';
import path from 'node:path';
import { Client } from 'pg';
import 'tsconfig-paths/register';
import { DataSource, DataSourceOptions } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const envConfig = new EnvConfigService(new ConfigService());

// Get the module name from the command line arguments
const moduleName = process.env.npm_config_module || '';

export async function setupDatabase(options: PostgresConnectionOptions) {
	const client = new Client({
		host: options.host,
		port: options.port,
		user: options.username,
		password: options.password,
		database: 'postgres',
	});

	try {
		await client.connect();

		const dbResult = await client.query(
			'SELECT 1 FROM pg_database WHERE datname = $1',
			[options.database],
		);
		if (dbResult.rowCount === 0) {
			await client.query(`CREATE DATABASE "${options.database}"`);
		}

		await client.end();

		const dbClient = new Client({
			host: options.host,
			port: options.port,
			user: options.username,
			password: options.password,
			database: options.database,
		});

		await dbClient.connect();

		const schemaExists = await dbClient.query(
			`
      SELECT schema_name FROM information_schema.schemata WHERE schema_name = $1
    `,
			[options.schema],
		);

		if (schemaExists.rowCount === 0) {
			await dbClient.query(`CREATE SCHEMA IF NOT EXISTS "${options.schema}"`);
		}
	} catch (error) {
		console.error('Error while create database or schema:', error);
	} finally {
		await client.end();
	}
}

export const dataSourceOptions: DataSourceOptions = {
	type: 'postgres',
	host: envConfig.getDbHost(),
	port: envConfig.getDbPort(),
	username: envConfig.getDbUsername(),
	password: envConfig.getDbPassword(),
	database: envConfig.getDbName(),
	schema: envConfig.getDbSchema(),
	entities: [
		path.resolve(
			__dirname,
			'../../../../shared/infra/database/typeorm/schemas/*.schema.{ts,js}',
		),
		path.resolve(
			__dirname,
			`../../../../**/${moduleName}/infra/database/typeorm/schemas/*.schema.{ts,js}`,
		),
	],
	migrations: [
		path.join(
			__dirname,
			'../../../../**/infra/database/typeorm/migrations/*.{ts,js}',
		),
	],
	synchronize: false,
	migrationsRun: false,
};

export default registerAs('typeorm', () => dataSourceOptions);
export const connectionSource = new DataSource(dataSourceOptions);
