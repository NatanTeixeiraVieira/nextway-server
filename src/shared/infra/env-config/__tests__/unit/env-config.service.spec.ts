import { Providers } from '@/shared/application/constants/providers';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { EnvConfigModule } from '../../env-config.module';
import { EnvConfigService } from '../../env-config.service';

describe('EnvConfigService unit tests', () => {
	let sut: EnvConfigService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [EnvConfigModule.forRoot()],
			providers: [
				{
					provide: Providers.ENV_CONFIG_SERVICE,
					useFactory: (configService: ConfigService) => {
						return new EnvConfigService(configService);
					},
					inject: [ConfigService],
				},
			],
		}).compile();

		sut = module.get<EnvConfigService>(Providers.ENV_CONFIG_SERVICE);

		process.env.DB_NAME = 'db_test';
		process.env.DB_PASSWORD = 'db_password_test';
		process.env.DB_USERNAME = 'test_db_username';
	});

	it('should be defined', () => {
		expect(sut).toBeDefined();
	});

	it('should return the variable PORT', () => {
		expect(sut.getPort()).toBe(3334);
	});

	it('should return the variable DB_HOST', () => {
		expect(sut.getDbHost()).toBe('localhost');
	});

	it('should return the variable DB_PORT', () => {
		expect(sut.getDbPort()).toBe(5432);
	});

	it('should return the variable BASE_URL', () => {
		expect(sut.getBaseUrl()).toBe('http://localhost:3333');
	});

	it('should return the variable DB_NAME', () => {
		expect(sut.getDbName()).toBe('db_test');
	});

	it('should return the variable DB_LOGS', () => {
		expect(sut.getDbLogs()).toBeTruthy();
	});

	it('should return the variable DB_USERNAME', () => {
		expect(sut.getDbUsername()).toBe('test_db_username');
	});

	it('should return the variable DB_PASSWORD', () => {
		expect(sut.getDbPassword()).toBe('db_password_test');
	});

	it('should return the variable DB_SCHEMA', () => {
		expect(sut.getDbSchema()).toBe('test');
	});

	it('should return the variable NODE_ENV', () => {
		expect(sut.getDbSchema()).toBe('test');
	});

	it('should return the variable MIGRATION_RUN', () => {
		expect(sut.getMigrationRun()).toBeTruthy();
	});

	it('should return the variable ENCRYPTION_SALTS', () => {
		expect(sut.getEncryptionSalts()).toBe(4);
	});

	it('should return the variable APPLICATION_MAIL_USER', () => {
		expect(sut.getApplicationMailUser()).toBe('test_mail_user');
	});

	it('should return the variable APPLICATION_MAIL_PASSWORD', () => {
		expect(sut.getApplicationMailPassword()).toBe('test_mail_password');
	});

	it('should return the variable ORIGIN', () => {
		expect(sut.getOrigin()).toBe('http://localhost:3000');
	});

	it('should return the variable ALLOWED_METHODS', () => {
		expect(sut.getAllowedMethods()).toBe('GET,POST,PUT,DELETE');
	});

	it('should return the variable JWT_SECRET', () => {
		expect(sut.getJwtSecret()).toBe('secret_jwt');
	});

	it('should return the variable JWT_EXPIRES_IN', () => {
		expect(sut.getJwtExpiresIn()).toBe(600);
	});

	it('should return the variable REFRESH_TOKEN_SECRET', () => {
		expect(sut.getRefreshTokenSecret()).toBe('secret_refresh_token');
	});

	it('should return the variable REFRESH_TOKEN_EXPIRES_IN', () => {
		expect(sut.getRefreshTokenExpiresIn()).toBe(6000);
	});

	it('should return the variable COOKIE_SECRET', () => {
		expect(sut.getCookiesSecret()).toBe('secret_cookies');
	});

	it('should return the variable RECOVER_USER_PASSWORD_TOKEN_SECRET', () => {
		expect(sut.getRecoverUserPasswordTokenSecret()).toBe(
			'secret_recover_user_password',
		);
	});

	it('should return the variable RECOVER_USER_PASSWORD_TOKEN_EXPIRES_IN', () => {
		expect(sut.getRecoverUserPasswordTokenExpiresIn()).toBe(3600);
	});

	it('should return the variable JWT_ACTIVATE_ACCOUNT_SECRET', () => {
		expect(sut.getJwtActiveAccountSecret()).toBe('secret_test');
	});

	it('should return the variable JWT_ACTIVATE_ACCOUNT_EXPIRES_IN', () => {
		expect(sut.getJwtActiveAccountExpiresIn()).toBe(1000);
	});

	it('should return the variable CLIENT_BASE_URL', () => {
		expect(sut.getClientBaseUrl()).toBe('http://localhost:3000');
	});

	it('should return the variable APPLICATION_MAIL_HOST', () => {
		expect(sut.getApplicationMailHost()).toBe('smtp.gmail.com');
	});

	it('should return the variable APPLICATION_MAIL_HOST', () => {
		expect(sut.getApplicationMailPort()).toBe(465);
	});

	it('should return the variable ZIPCODE_API_BASE_URL', () => {
		expect(sut.getZipcodeApiBaseUrl()).toBe(
			'https://zipcode-base-api-test.com.br/json',
		);
	});

	it('should return the variable CNPJ_API_BASE_URL', () => {
		expect(sut.getCnpjApiBaseUrl()).toBe(
			'https://cnpj-api-test.com.br/v1/cnpj',
		);
	});

	it('should return the variable PAYMENT_ACCESS_TOKEN', () => {
		expect(sut.getPaymentAccessToken()).toBe('payment_test_access_token');
	});

	it('should return the variable PAYMENT_SECRET_SIGNATURE', () => {
		expect(sut.getPaymentSecretSignature()).toBe(
			'payment_test_secret_signature',
		);
	});

	it('should return the variable PAYMENT_TEST_PAYER_EMAIL', () => {
		expect(sut.getPaymentTestPayerEmail()).toBe('user@user.com');
	});

	it('should return the variable PAYMENT_REDIRECT_URL', () => {
		expect(sut.getPaymentRedirectUrl()).toBe('https://www.google.com');
	});

	it('should return the variable RABBITMQ_USER', () => {
		expect(sut.getMessagingUser()).toBe('rabbitmq_user');
	});

	it('should return the variable RABBITMQ_PASSWORD', () => {
		expect(sut.getMessagingPassword()).toBe('rabbitmq_password');
	});

	it('should return the variable RABBITMQ_URL', () => {
		expect(sut.getMessagingBrokerUrls()).toEqual([
			'amqp://admin:admin@localhost:5672',
		]);
	});

	it('should return the variable RABBITMQ_QUEUE_NAME', () => {
		expect(sut.getMessagingBrokerQueueName()).toBe('nextway_queue');
	});
});
