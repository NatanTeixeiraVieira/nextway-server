import { ConfigService } from '@nestjs/config';
import { EnvConfig } from 'src/shared/application/env-config/env-config';

export class EnvConfigService implements EnvConfig {
	constructor(private readonly configService: ConfigService) {}

	getPort(): number {
		return Number(this.configService.get<string>('PORT'));
	}

	getDbHost(): string {
		return this.configService.get<string>('DB_HOST');
	}

	getDbPort(): number {
		return +this.configService.get<string>('DB_PORT');
	}

	getDbName(): string {
		return this.configService.get<string>('DB_NAME');
	}

	getDbLogs(): boolean {
		return this.configService.get<string>('DB_LOGS') === 'true';
	}

	getDbUsername(): string {
		return this.configService.get<string>('DB_USERNAME');
	}

	getDbPassword(): string {
		return this.configService.get<string>('DB_PASSWORD');
	}

	getDbSchema(): string {
		return this.configService.get<string>('DB_SCHEMA');
	}

	getNodeEnv(): 'production' | 'development' {
		return this.configService.get<'production' | 'development'>('NODE_ENV');
	}

	getMigrationRun(): boolean {
		return this.configService.get<string>('MIGRATION_RUN') === 'true';
	}
}
