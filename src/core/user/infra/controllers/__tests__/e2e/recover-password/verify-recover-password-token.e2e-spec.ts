import { UserSchema } from '@/core/user/infra/database/typeorm/schemas/user.schema';
import { Providers } from '@/shared/application/constants/providers';
import { EnvConfig } from '@/shared/application/env-config/env-config';
import { ErrorMessages } from '@/shared/application/error-messages/error-messages';
import { JwtService } from '@/shared/application/services/jwt.service';
import { appFastifyConfigTest } from '@/testing/app-config-test';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import request from 'supertest';
import { DataSource, Repository } from 'typeorm';

describe('UserController recoverUserPasswordVerifyToken e2e test', () => {
	let app: NestFastifyApplication;
	let dataSource: DataSource;
	let typeOrmUserRepository: Repository<UserSchema>;
	let envConfigService: EnvConfig;
	let jwtService: JwtService;

	beforeAll(async () => {
		const { fastifyApp, module } = await appFastifyConfigTest();
		app = fastifyApp;

		dataSource = module.get<DataSource>(DataSource);
		typeOrmUserRepository = dataSource.getRepository(UserSchema);
		envConfigService = module.get(Providers.ENV_CONFIG_SERVICE);
		jwtService = module.get(Providers.JWT_SERVICE);
	});

	beforeEach(async () => {
		await typeOrmUserRepository.clear();
	});

	afterAll(async () => {
		await app.close();
	});

	it('should throw an error when token is not provided', async () => {
		const response = await request(app.getHttpServer())
			.post('/api/user/v1/recover-password/verify-token')
			.expect(400);

		expect(response.body).toStrictEqual({
			statusCode: 400,
			error: 'Bad Request Error',
			message: ErrorMessages.INVALID_TOKEN,
		});
	});

	it('should return false when token is invalid', async () => {
		const response = await request(app.getHttpServer())
			.post('/api/user/v1/recover-password/verify-token')
			.send({ token: 'invalid_token' })
			.expect(200);

		expect(response.body).toStrictEqual({ isValid: false });
	});

	it('should verify recover password token', async () => {
		const recoverPasswordSecret =
			envConfigService.getRecoverUserPasswordTokenSecret();

		const recoverPasswordExpiresInInSeconds =
			envConfigService.getRecoverUserPasswordTokenExpiresIn();

		const { token } = await jwtService.generateJwt(
			{
				sub: 'test',
				email: 'email@test.com',
			},
			{
				expiresIn: recoverPasswordExpiresInInSeconds,
				secret: recoverPasswordSecret,
			},
		);

		const response = await request(app.getHttpServer())
			.post('/api/user/v1/recover-password/verify-token')
			.send({ token })
			.expect(200);

		expect(response.body).toStrictEqual({ isValid: true });
	});
});
