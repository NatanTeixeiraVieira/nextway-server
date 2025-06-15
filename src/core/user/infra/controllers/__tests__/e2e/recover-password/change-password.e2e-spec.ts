import { RecoverPasswordPayload } from '@/core/user/application/usecases/recover-password/send-password-recovery-email.usecase';
import { UserDataBuilder } from '@/core/user/domain/testing/helpers/user-data-builder';
import { UserSchema } from '@/core/user/infra/database/typeorm/schemas/user.schema';
import { ChangePasswordDto } from '@/core/user/infra/dtos/change-password.dto';
import { Providers } from '@/shared/application/constants/providers';
import { EnvConfig } from '@/shared/application/env-config/env-config';
import { ErrorMessages } from '@/shared/application/error-messages/error-messages';
import { HashService } from '@/shared/application/services/hash.service';
import { JwtService } from '@/shared/application/services/jwt.service';
import { Mutable } from '@/shared/application/types/utils';
import { appFastifyConfigTest } from '@/testing/app-config-test';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { DataSource, Repository } from 'typeorm';

describe('UserController changeUserPassword e2e test', () => {
	let app: NestFastifyApplication;
	let dataSource: DataSource;
	let typeOrmUserRepository: Repository<UserSchema>;
	let jwtService: JwtService;
	let envConfigService: EnvConfig;
	let changePasswordDto: Partial<Mutable<ChangePasswordDto>>;
	let typeOrmRepositoryUser: Repository<UserSchema>;
	let hashService: HashService;
	const userId = 'cd6393fd-2617-4bda-92d4-6b684010f80d';

	beforeAll(async () => {
		const { fastifyApp, module } = await appFastifyConfigTest();
		app = fastifyApp;

		dataSource = module.get<DataSource>(DataSource);
		typeOrmUserRepository = dataSource.getRepository(UserSchema);
		jwtService = module.get(Providers.JWT_SERVICE);
		envConfigService = module.get(Providers.ENV_CONFIG_SERVICE);
		typeOrmRepositoryUser = module.get<Repository<UserSchema>>(
			getRepositoryToken(UserSchema),
		);
		hashService = module.get(Providers.HASH_SERVICE);
	});

	beforeEach(async () => {
		await typeOrmUserRepository.clear();
		const recoverPasswordSecret =
			envConfigService.getRecoverUserPasswordTokenSecret();

		const payload: RecoverPasswordPayload = {
			sub: userId,
			email: 'test@email.com',
		};

		const recoverPasswordExpiresInInSeconds =
			envConfigService.getRecoverUserPasswordTokenExpiresIn();
		const { token } = await jwtService.generateJwt<RecoverPasswordPayload>(
			payload,
			{
				expiresIn: recoverPasswordExpiresInInSeconds,
				secret: recoverPasswordSecret,
			},
		);

		await typeOrmRepositoryUser.save({
			...UserDataBuilder({
				active: true,
				email: 'test@email.com',
				forgotPasswordEmailVerificationToken: token,
			}),
			id: userId,
		});

		changePasswordDto = {
			changePasswordToken: token,
			password: 'new_password_test',
		};
	});

	afterAll(async () => {
		await app.close();
	});

	it('should throw an error when change password token is invalid', async () => {
		changePasswordDto.changePasswordToken = 'invalid_token';

		const response = await request(app.getHttpServer())
			.post('/api/user/v1/recover-password/change-password')
			.send(changePasswordDto)
			.expect(401);

		expect(response.body).toStrictEqual({
			statusCode: 401,
			error: 'Invalid Token Error',
			message: ErrorMessages.INVALID_CHANGE_PASSWORD_TOKEN,
		});
	});

	it('should throw an error when change password token is different of DB', async () => {
		await typeOrmRepositoryUser.clear();
		await typeOrmRepositoryUser.save({
			...UserDataBuilder({
				active: true,
				email: 'test@email.com',
				forgotPasswordEmailVerificationToken: 'different_token',
			}),
			id: userId,
		});
		const response = await request(app.getHttpServer())
			.post('/api/user/v1/recover-password/change-password')
			.send(changePasswordDto)
			.expect(401);

		expect(response.body).toStrictEqual({
			statusCode: 401,
			error: 'Invalid Token Error',
			message: ErrorMessages.INVALID_CHANGE_PASSWORD_TOKEN,
		});
	});

	it('should throw an error when user is not found', async () => {
		await typeOrmUserRepository.clear();
		const response = await request(app.getHttpServer())
			.post('/api/user/v1/recover-password/change-password')
			.send(changePasswordDto)
			.expect(404);

		expect(response.body).toStrictEqual({
			statusCode: 404,
			error: 'Not Found Error',
			message: ErrorMessages.USER_NOT_FOUND,
		});
	});

	it('should throw an error when password is nto provided', async () => {
		delete changePasswordDto.password;

		const response = await request(app.getHttpServer())
			.post('/api/user/v1/recover-password/change-password')
			.send(changePasswordDto)
			.expect(422);

		expect(response.body).toStrictEqual({
			statusCode: 422,
			error: 'Unprocessable Entity',
			message: ['password must be longer than or equal to 8 characters'],
		});
	});

	it('should throw an error when password is shorter that 8 characters', async () => {
		changePasswordDto.password = '1234567';

		const response = await request(app.getHttpServer())
			.post('/api/user/v1/recover-password/change-password')
			.send(changePasswordDto)
			.expect(422);

		expect(response.body).toStrictEqual({
			statusCode: 422,
			error: 'Unprocessable Entity',
			message: ['password must be longer than or equal to 8 characters'],
		});
	});

	it('should change user password', async () => {
		const response = await request(app.getHttpServer())
			.post('/api/user/v1/recover-password/change-password')
			.send(changePasswordDto)
			.expect(204);

		expect(response.body).toStrictEqual({});

		const user = await typeOrmRepositoryUser.findOneBy({ id: userId });
		const isPasswordValid = await hashService.compare(
			'new_password_test',
			user?.password ?? '',
		);

		expect(isPasswordValid).toBeTruthy();
	});
});
