import { UserCookiesName } from '@/core/user/application/constants/cookies';
import { UserProviders } from '@/core/user/application/constants/providers';
import { UserRepository } from '@/core/user/domain/repositories/user.repository';
import { UserDataBuilder } from '@/core/user/domain/testing/helpers/user-data-builder';
import { Providers } from '@/shared/application/constants/providers';
import { EnvConfig } from '@/shared/application/env-config/env-config';
import { ErrorMessages } from '@/shared/application/error-messages/error-messages';
import { JwtService } from '@/shared/application/services/jwt.service';
import { appFastifyConfigTest } from '@/shared/infra/testing/app-config-test';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import request from 'supertest';
import { DataSource, Repository } from 'typeorm';
import { UserSchema } from '../../../database/typeorm/schemas/user.schema';

describe('UserController checkUserEmail e2e tests', () => {
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
		userRepository = module.get<UserRepository>(UserProviders.USER_REPOSITORY);
		jwtService = module.get<JwtService>(Providers.JWT_SERVICE);
		envConfigService = module.get<EnvConfig>(Providers.ENV_CONFIG_SERVICE);
	});

	beforeEach(async () => {
		await typeOrmUserRepository.clear();
	});

	afterAll(async () => {
		await app.close();
	});

	it('should throw an error when checkEmailToken is invalid', async () => {
		const response = await request(app.getHttpServer())
			.post('/api/user/v1/check-email')
			.send({ token: 'invalid-token' })
			.expect(401);

		expect(response.body).toStrictEqual({
			statusCode: 401,
			error: 'Invalid Token Error',
			message: ErrorMessages.INVALID_TOKEN,
		});
	});

	it('should throw an error when user is not found', async () => {
		const { token } = await jwtService.generateJwt(
			{ sub: '3a29b7c6-e3f1-463d-a401-064891dedae8' },
			{
				expiresIn: envConfigService.getJwtActiveAccountExpiresIn(),
				secret: envConfigService.getJwtActiveAccountSecret(),
			},
		);
		const response = await request(app.getHttpServer())
			.post(`/api/user/v1/check-email`)
			.send({ token })
			.expect(404);

		expect(response.body).toStrictEqual({
			statusCode: 404,
			error: 'Not Found Error',
			message: ErrorMessages.USER_NOT_FOUND,
		});
	});

	it('should check user email', async () => {
		const id = '3a29b7c6-e3f1-463d-a401-064891dedae8';
		await typeOrmUserRepository.save({
			...UserDataBuilder({
				email: 'test@email.com',
				emailVerified: null,
				active: false,
			}),
			id,
		});

		const { token } = await jwtService.generateJwt(
			{ sub: id },
			{
				expiresIn: envConfigService.getJwtActiveAccountExpiresIn(),
				secret: envConfigService.getJwtActiveAccountSecret(),
			},
		);

		const response = await request(app.getHttpServer())
			.post(`/api/user/v1/check-email`)
			.send({ token })
			.expect(200);

		expect(response.body).toStrictEqual({
			id,
			email: 'test@email.com',
		});

		expect(response.headers['set-cookie'][0]).toContain(
			`${UserCookiesName.ACCESS_TOKEN}=`,
		);
		expect(response.headers['set-cookie'][0]).toContain(
			`Max-Age=${envConfigService.getJwtExpiresIn()}`,
		);
		expect(response.headers['set-cookie'][0]).toContain(`HttpOnly;`);
		expect(response.headers['set-cookie'][0]).toContain(`SameSite=Strict`);

		expect(response.headers['set-cookie'][1]).toContain(
			`${UserCookiesName.REFRESH_TOKEN}=`,
		);
		expect(response.headers['set-cookie'][1]).toContain(
			`Max-Age=${envConfigService.getRefreshTokenExpiresIn()}`,
		);
		expect(response.headers['set-cookie'][1]).toContain(`HttpOnly;`);
		expect(response.headers['set-cookie'][1]).toContain(`SameSite=Strict`);

		const user = await typeOrmUserRepository.findOneBy({ id });
		expect(user?.emailVerified).toBeInstanceOf(Date);
		expect(user?.active).toBeTruthy();
		expect(user?.updatedAt).toBeInstanceOf(Date);
	});
});
