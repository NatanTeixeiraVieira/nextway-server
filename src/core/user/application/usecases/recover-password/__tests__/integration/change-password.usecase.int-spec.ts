import { UserProviders } from '@/core/user/application/constants/providers';
import { User } from '@/core/user/domain/entities/user.entity';
import { UserRepository } from '@/core/user/domain/repositories/user.repository';
import { UserDataBuilder } from '@/core/user/domain/testing/helpers/user-data-builder';
import { UserSchema } from '@/core/user/infra/database/typeorm/schemas/user.schema';
import { UserModule } from '@/core/user/infra/user.module';
import { Providers } from '@/shared/application/constants/providers';
import { EnvConfig } from '@/shared/application/env-config/env-config';
import { HashService } from '@/shared/application/services/hash.service';
import { JwtService } from '@/shared/application/services/jwt.service';
import { LoggedUserService } from '@/shared/application/services/logged-user.service';
import { configTypeOrmModule } from '@/shared/infra/database/typeorm/testing/config-typeorm-module-tests';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChangePasswordUseCase } from '../../change-password.usecase';
import { RecoverPasswordPayload } from '../../send-password-recovery-email.usecase';

describe('ChangePasswordUseCase unit tests', () => {
	let module: TestingModule;
	let typeOrmRepositoryUser: Repository<UserSchema>;
	let jwtService: JwtService;
	let envConfigService: EnvConfig;
	let userRepository: UserRepository;
	let hashService: HashService;
	let loggedUserService: LoggedUserService;

	let sut: ChangePasswordUseCase;

	beforeAll(async () => {
		module = await Test.createTestingModule({
			imports: [
				TypeOrmModule.forFeature([UserSchema]),
				configTypeOrmModule(),
				UserModule,
			],
		}).compile();

		typeOrmRepositoryUser = module.get<Repository<UserSchema>>(
			getRepositoryToken(UserSchema),
		);
		jwtService = module.get(Providers.JWT_SERVICE);
		envConfigService = module.get(Providers.ENV_CONFIG_SERVICE);
		userRepository = module.get(UserProviders.USER_REPOSITORY);
		hashService = module.get(Providers.HASH_SERVICE);
		loggedUserService = await module.resolve(Providers.LOGGED_USER_SERVICE);
	});

	beforeEach(async () => {
		sut = new ChangePasswordUseCase(
			jwtService,
			userRepository,
			hashService,
			loggedUserService,
		);

		await typeOrmRepositoryUser.clear();
	});

	afterAll(async () => {
		await module.close();
	});

	it('should change user password', async () => {
		const userId = 'cd6393fd-2617-4bda-92d4-6b684010f80d';
		const payload: RecoverPasswordPayload = {
			sub: userId,
			email: 'test@email.com',
		};

		const recoverPasswordSecret =
			envConfigService.getRecoverUserPasswordTokenSecret();

		const recoverPasswordExpiresInInSeconds =
			envConfigService.getRecoverUserPasswordTokenExpiresIn();
		const { token } = await jwtService.generateJwt<RecoverPasswordPayload>(
			payload,
			{
				expiresIn: recoverPasswordExpiresInInSeconds,
				secret: recoverPasswordSecret,
			},
		);
		const user = {
			...UserDataBuilder({
				email: 'test@email.com',
				forgotPasswordEmailVerificationToken: token,
			}),
			id: userId,
		};
		await typeOrmRepositoryUser.save(user);

		loggedUserService.setLoggedUser(new User(user));

		const output = await sut.execute({
			changePasswordToken: token,
			password: 'new_password_test',
		});

		const foundUser = await typeOrmRepositoryUser.findOneBy({ id: userId });
		const isPasswordValid = await hashService.compare(
			'new_password_test',
			foundUser?.password ?? '',
		);

		expect(isPasswordValid).toBeTruthy();
		expect(output).toBeUndefined();
	});
});
