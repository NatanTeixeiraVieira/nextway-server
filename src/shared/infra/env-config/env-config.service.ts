import { ConfigService } from '@nestjs/config';
import {
	EnvConfig,
	NodeEnv,
} from 'src/shared/application/env-config/env-config';

export class EnvConfigService implements EnvConfig {
	constructor(private readonly configService: ConfigService) {}

	getStorageUrl(): string {
		throw new Error('Method not implemented.');
	}

	getStorageApiKey(): string {
		throw new Error('Method not implemented.');
	}

	getPaymentAccessToken(): string {
		return this.configService.get<string>('PAYMENT_ACCESS_TOKEN') as string;
	}

	getPaymentTestPayerEmail(): string {
		return this.configService.get<string>('PAYMENT_TEST_PAYER_EMAIL') as string;
	}

	getPaymentSecretSignature(): string {
		return this.configService.get<string>('PAYMENT_SECRET_SIGNATURE') as string;
	}

	getPaymentRedirectUrl(): string {
		return this.configService.get<string>('PAYMENT_REDIRECT_URL') as string;
	}

	getCnpjApiBaseUrl(): string {
		return this.configService.get<string>('CNPJ_API_BASE_URL') as string;
	}

	getPort(): number {
		return Number(this.configService.get<string>('PORT') as string);
	}

	getJwtSecret(): string {
		return this.configService.get<string>('JWT_SECRET') as string;
	}

	getJwtExpiresIn(): number {
		return Number(this.configService.get<string>('JWT_EXPIRES_IN') as string);
	}

	getRefreshTokenSecret(): string {
		return this.configService.get<string>('REFRESH_TOKEN_SECRET') as string;
	}

	getRefreshTokenExpiresIn(): number {
		return Number(
			this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN') as string,
		);
	}

	getCookiesSecret(): string {
		return this.configService.get<string>('COOKIE_SECRET') as string;
	}

	getDbHost(): string {
		return this.configService.get<string>('DB_HOST') as string;
	}

	getDbPort(): number {
		return Number(this.configService.get<string>('DB_PORT') as string);
	}

	getDbName(): string {
		return this.configService.get<string>('DB_NAME') as string;
	}

	getDbLogs(): boolean {
		return (this.configService.get<string>('DB_LOGS') as string) === 'true';
	}

	getDbUsername(): string {
		return this.configService.get<string>('DB_USERNAME') as string;
	}

	getDbPassword(): string {
		return this.configService.get<string>('DB_PASSWORD') as string;
	}

	getDbSchema(): string {
		return this.configService.get<string>('DB_SCHEMA') as string;
	}

	getNodeEnv(): NodeEnv {
		return this.configService.get<NodeEnv>('NODE_ENV') as NodeEnv;
	}

	getMigrationRun(): boolean {
		return this.configService.get<string>('MIGRATION_RUN') === 'true';
	}

	getBaseUrl(): string {
		return this.configService.get<string>('BASE_URL') as string;
	}

	getJwtActiveAccountSecret(): string {
		return this.configService.get<string>(
			'JWT_ACTIVATE_ACCOUNT_SECRET',
		) as string;
	}

	getJwtActiveAccountExpiresIn(): number {
		return Number(
			this.configService.get<string>(
				'JWT_ACTIVATE_ACCOUNT_EXPIRES_IN',
			) as string,
		);
	}

	getEncryptionSalts(): number {
		return Number(this.configService.get<string>('ENCRYPTION_SALTS') as string);
	}

	getApplicationMailHost(): string {
		return this.configService.get<string>('APPLICATION_MAIL_HOST') as string;
	}

	getApplicationMailUser(): string {
		return this.configService.get<string>('APPLICATION_MAIL_USER') as string;
	}

	getApplicationMailPort(): number {
		return Number(this.configService.get<string>('APPLICATION_MAIL_PORT'));
	}

	getApplicationMailPassword(): string {
		return this.configService.get<string>(
			'APPLICATION_MAIL_PASSWORD',
		) as string;
	}

	getOrigin(): string {
		return this.configService.get<string>('ORIGIN') as string;
	}

	getAllowedMethods(): string {
		return this.configService.get<string>('ALLOWED_METHODS') as string;
	}

	getRecoverUserPasswordTokenSecret(): string {
		return this.configService.get<string>(
			'RECOVER_USER_PASSWORD_TOKEN_SECRET',
		) as string;
	}

	getRecoverUserPasswordTokenExpiresIn(): number {
		return Number(
			this.configService.get<string>(
				'RECOVER_USER_PASSWORD_TOKEN_EXPIRES_IN',
			) as string,
		);
	}

	getClientBaseUrl(): string {
		return this.configService.get<string>('CLIENT_BASE_URL') as string;
	}

	getZipcodeApiBaseUrl(): string {
		return this.configService.get<string>('ZIPCODE_API_BASE_URL') as string;
	}

	getMessagingBrokerUrls(): string[] {
		return [this.configService.get<string>('RABBITMQ_URL') as string];
	}

	getMessagingBrokerQueueName(): string {
		return this.configService.get<string>('RABBITMQ_QUEUE_NAME') as string;
	}

	getMessagingUser(): string {
		return this.configService.get<string>('RABBITMQ_USER') as string;
	}
	getMessagingPassword(): string {
		return this.configService.get<string>('RABBITMQ_PASSWORD') as string;
	}
}
