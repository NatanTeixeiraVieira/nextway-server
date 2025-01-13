import { UserRepository } from '@/core/user/domain/repositories/user.repository';
import { UserDataBuilder } from '@/core/user/domain/testing/helpers/user-data-builder';
import { CookiesName } from '@/shared/application/constants/cookies';
import { Providers } from '@/shared/application/constants/providers';
import { EnvConfig } from '@/shared/application/env-config/env-config';
import { ErrorMessages } from '@/shared/application/error-messages/error-messages';
import { JwtService } from '@/shared/application/services/jwt.service';
import { appFastifyConfigTest } from '@/testing/app-config-test';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import request from 'supertest';
import { DataSource, Repository } from 'typeorm';
import { UserSchema } from '../../../database/typeorm/schemas/user.schema';

describe('UserController refreshToken e2e tests', () => {
	let app: NestFastifyApplication;
	let dataSource: DataSource;
	let typeOrmUserRepository: Repository<UserSchema>;
	let userRepository: UserRepository;
	let jwtService: JwtService;
	let envConfigService: EnvConfig;

	beforeAll(async () => {
		const { fastifyApp, module } = await appFastifyConfigTest();
		app = fastifyApp;

		dataSource = module.get<DataSource>(DataSource);
		typeOrmUserRepository = dataSource.getRepository(UserSchema);
		userRepository = module.get<UserRepository>(Providers.USER_REPOSITORY);
		jwtService = module.get<JwtService>(Providers.JWT_SERVICE);
		envConfigService = module.get<EnvConfig>(Providers.ENV_CONFIG_SERVICE);
	});

	beforeEach(async () => {
		await typeOrmUserRepository.clear();
	});

	afterAll(async () => {
		await app.close();
	});

	it('should throw an error when refresh token is not provided', async () => {
		const response = await request(app.getHttpServer())
			.post('/api/user/v1/refresh')
			.expect(401);

		expect(response.body).toStrictEqual({
			statusCode: 401,
			error: 'Invalid Token Error',
			message: ErrorMessages.INVALID_REFRESH_TOKEN,
		});
	});

	it('should throw an error when refresh token is invalid', async () => {
		const response = await request(app.getHttpServer())
			.post('/api/user/v1/refresh')
			.set('Cookie', `${CookiesName.REFRESH_TOKEN}=invalid-token`)
			.expect(401);

		expect(response.body).toStrictEqual({
			statusCode: 401,
			error: 'Invalid Token Error',
			message: ErrorMessages.INVALID_REFRESH_TOKEN,
		});
	});

	it('should throw an error when user is not found', async () => {
		const { token } = await jwtService.generateJwt(
			{ sub: '3f6bbfe0-afde-45e5-8621-6710c86b6cac' },
			{
				expiresIn: envConfigService.getRefreshTokenExpiresIn(),
				secret: envConfigService.getRefreshTokenSecret(),
			},
		);

		const response = await request(app.getHttpServer())
			.post('/api/user/v1/refresh')
			.set('Cookie', `${CookiesName.REFRESH_TOKEN}=${token}`)
			.expect(404);

		expect(response.body).toStrictEqual({
			statusCode: 404,
			error: 'Not Found Error',
			message: ErrorMessages.USER_NOT_FOUND,
		});
	});

	it('should refresh user token', async () => {
		const id = '3a29b7c6-e3f1-463d-a401-064891dedae8';
		await typeOrmUserRepository.save({
			...UserDataBuilder({
				email: 'test@email.com',
				emailVerified: new Date(),
				active: true,
			}),
			id,
		});

		const { token } = await jwtService.generateJwt(
			{ sub: id },
			{
				expiresIn: envConfigService.getRefreshTokenExpiresIn(),
				secret: envConfigService.getRefreshTokenSecret(),
			},
		);

		const response = await request(app.getHttpServer())
			.post('/api/user/v1/refresh')
			.set('Cookie', `${CookiesName.REFRESH_TOKEN}=${token}`)
			.expect(200);

		expect(response.headers['set-cookie'][0]).toContain(
			`${CookiesName.ACCESS_TOKEN}=`,
		);
		expect(response.headers['set-cookie'][0]).toContain(
			`Max-Age=${envConfigService.getJwtExpiresIn()}`,
		);
		expect(response.headers['set-cookie'][0]).toContain(`HttpOnly;`);
		expect(response.headers['set-cookie'][0]).toContain(`SameSite=Strict`);
	});
});
