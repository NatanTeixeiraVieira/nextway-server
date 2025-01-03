import { ConfigService } from '@nestjs/config';
import {
	EnvConfig,
	NodeEnv,
} from 'src/shared/application/env-config/env-config';

export class EnvConfigService implements EnvConfig {
	constructor(private readonly configService: ConfigService) {}

	getPort(): number {
		return Number(this.configService.get<string>('PORT'));
	}

	getJwtSecret(): string {
		return this.configService.get<string>('JWT_SECRET');
	}

	getJwtExpiresIn(): number {
		return Number(this.configService.get<string>('JWT_EXPIRES_IN'));
	}

	getRefreshTokenSecret(): string {
		return this.configService.get<string>('REFRESH_TOKEN_SECRET');
	}

	getRefreshTokenExpiresIn(): number {
		return Number(this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN'));
	}

	getCookiesSecret(): string {
		return this.configService.get<string>('COOKIE_SECRET');
	}

	getDbHost(): string {
		return this.configService.get<string>('DB_HOST');
	}

	getDbPort(): number {
		return Number(this.configService.get<string>('DB_PORT'));
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

	getNodeEnv(): NodeEnv {
		return this.configService.get<NodeEnv>('NODE_ENV');
	}

	getMigrationRun(): boolean {
		return this.configService.get<string>('MIGRATION_RUN') === 'true';
	}

	getBaseUrl(): string {
		return this.configService.get<string>('BASE_URL');
	}

	getJwtActiveAccountSecret(): string {
		return this.configService.get<string>('JWT_ACTIVATE_ACCOUNT_SECRET');
	}

	getJwtActiveAccountExpiresIn(): number {
		return Number(
			this.configService.get<string>('JWT_ACTIVATE_ACCOUNT_EXPIRES_IN'),
		);
	}

	getEncryptionSalts(): number {
		return Number(this.configService.get<string>('ENCRYPTION_SALTS'));
	}

	getApplicationMailUser(): string {
		return this.configService.get<string>('APPLICATION_MAIL_USER');
	}

	getApplicationMailPassword(): string {
		return this.configService.get<string>('APPLICATION_MAIL_PASSWORD');
	}

	getOrigin(): string {
		return this.configService.get<string>('ORIGIN');
	}

	getAllowedMethods(): string {
		return this.configService.get<string>('ALLOWED_METHODS');
	}
}
