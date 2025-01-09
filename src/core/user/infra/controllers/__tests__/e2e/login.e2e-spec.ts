import { UserRepository } from '@/core/user/domain/repositories/user.repository';
import { UserDataBuilder } from '@/core/user/domain/testing/helpers/user-data-builder';
import { CookiesName } from '@/shared/application/constants/cookies';
import { Providers } from '@/shared/application/constants/providers';
import { EnvConfig } from '@/shared/application/env-config/env-config';
import { ErrorMessages } from '@/shared/application/error-messages/error-messages';
import { appFastifyConfigTest } from '@/testing/app-config-test';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import bcrypt from 'bcrypt';
import request from 'supertest';
import { DataSource, Repository } from 'typeorm';
import { UserSchema } from '../../../database/typeorm/schemas/user.schema';

describe('UserController userLogin e2e tests', () => {
	let app: NestFastifyApplication;
	let dataSource: DataSource;
	let typeOrmUserRepository: Repository<UserSchema>;
	let envConfigService: EnvConfig;
	let userRepository: UserRepository;

	beforeAll(async () => {
		const { fastifyApp, module } = await appFastifyConfigTest();
		app = fastifyApp;

		dataSource = module.get<DataSource>(DataSource);
		typeOrmUserRepository = dataSource.getRepository(UserSchema);
		userRepository = module.get<UserRepository>(Providers.USER_REPOSITORY);
		envConfigService = module.get<EnvConfig>(Providers.ENV_CONFIG_SERVICE);
	});

	beforeEach(async () => {
		await typeOrmUserRepository.clear();
	});

	afterAll(async () => {
		await app.close();
	});

	it('should throw an error when email or password is invalid', async () => {
		const response = await request(app.getHttpServer())
			.post('/api/user/v1/login')
			.send({ email: 'test@email', password: '1234567' })
			.expect(422);

		expect(response.body).toStrictEqual({
			statusCode: 422,
			error: 'Unprocessable Entity',
			message: [
				'email must be an email',
				'password must be longer than or equal to 8 characters',
			],
		});
	});

	it('should throw an error when user is not found', async () => {
		const response = await request(app.getHttpServer())
			.post('/api/user/v1/login')
			.send({ email: 'test@email.com', password: '12345678' })
			.expect(422);

		expect(response.body).toStrictEqual({
			statusCode: 422,
			error: 'Invalid Credentials Error',
			message: ErrorMessages.INVALID_CREDENTIALS,
		});
	});

	it('should throw an error when password is incorrect', async () => {
		const id = '3a29b7c6-e3f1-463d-a401-064891dedae8';
		await typeOrmUserRepository.save({
			...UserDataBuilder({
				email: 'test@email.com',
				password: await bcrypt.hash(
					'test password',
					envConfigService.getEncryptionSalts(),
				),
				emailVerified: new Date(),
				active: true,
			}),
			id,
		});

		const response = await request(app.getHttpServer())
			.post('/api/user/v1/login')
			.send({ email: 'test@email.com', password: '12345678' })
			.expect(422);

		expect(response.body).toStrictEqual({
			statusCode: 422,
			error: 'Invalid Credentials Error',
			message: ErrorMessages.INVALID_CREDENTIALS,
		});
	});

	it('should do user login', async () => {
		const id = '3a29b7c6-e3f1-463d-a401-064891dedae8';
		await typeOrmUserRepository.save({
			...UserDataBuilder({
				email: 'test@email.com',
				password: await bcrypt.hash(
					'test password',
					envConfigService.getEncryptionSalts(),
				),
				emailVerified: new Date(),
				active: true,
			}),
			id,
		});

		const response = await request(app.getHttpServer())
			.post('/api/user/v1/login')
			.send({ email: 'test@email.com', password: 'test password' })
			.expect(200);

		expect(response.body).toStrictEqual({
			id,
			email: 'test@email.com',
		});

		expect(response.headers['set-cookie'][0]).toContain(
			`${CookiesName.ACCESS_TOKEN}=`,
		);
		expect(response.headers['set-cookie'][0]).toContain(
			`Max-Age=${envConfigService.getJwtExpiresIn()}`,
		);
		expect(response.headers['set-cookie'][0]).toContain(`HttpOnly;`);
		expect(response.headers['set-cookie'][0]).toContain(`SameSite=Strict`);

		expect(response.headers['set-cookie'][1]).toContain(
			`${CookiesName.REFRESH_TOKEN}=`,
		);
		expect(response.headers['set-cookie'][1]).toContain(
			`Max-Age=${envConfigService.getRefreshTokenExpiresIn()}`,
		);
		expect(response.headers['set-cookie'][1]).toContain(`HttpOnly;`);
		expect(response.headers['set-cookie'][1]).toContain(`SameSite=Strict`);
	});
});
