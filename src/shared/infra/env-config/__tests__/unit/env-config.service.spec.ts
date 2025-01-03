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
					provide: EnvConfigService,
					useFactory: (configService: ConfigService) => {
						return new EnvConfigService(configService);
					},
					inject: [ConfigService],
				},
			],
		}).compile();

		sut = module.get<EnvConfigService>(EnvConfigService);

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
		expect(sut.getOrigin()).toBe('localhost:3000');
	});

	it('should return the variable ALLOWED_METHODS', () => {
		expect(sut.getAllowedMethods()).toBe('GET,POST,PUT,DELETE');
	});
});
