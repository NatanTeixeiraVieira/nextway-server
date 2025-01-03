import { UserRepository } from '@/core/user/domain/repositories/user.repository';
import { UserDataBuilder } from '@/core/user/domain/testing/helpers/user-data-builder';
import { UserTypeormRepositoryMapper } from '@/core/user/infra/database/typeorm/repositories/user-typeorm-repository-mapper';
import { UserTypeOrmRepository } from '@/core/user/infra/database/typeorm/repositories/user-typeorm.repository';
import { UserSchema } from '@/core/user/infra/database/typeorm/schemas/user.schema';
import { EnvConfig } from '@/shared/application/env-config/env-config';
import { AuthService } from '@/shared/application/services/auth.service';
import { JwtService } from '@/shared/application/services/jwt.service';
import { configTypeOrmModule } from '@/shared/infra/database/typeorm/testing/config-typeorm-module-tests';
import { EnvConfigService } from '@/shared/infra/env-config/env-config.service';
import { AuthAppJwtService } from '@/shared/infra/services/auth-service/app-jwt-service/auth-app-jwt-service.service';
import { JwtNestjsService } from '@/shared/infra/services/jwt-service/nestjs/jwt-nestjs.service';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
	addTransactionalDataSource,
	initializeTransactionalContext,
	StorageDriver,
} from 'typeorm-transactional';
import { CheckEmailUseCase } from '../../check-email.usecase';

describe('CheckEmailUseCase integration tests', () => {
	const userTypeormRepositoryMapper = new UserTypeormRepositoryMapper();
	let typeOrmRepositoryUser: Repository<UserSchema>;
	let module: TestingModule;
	let userRepository: UserRepository;
	let jwtService: JwtService;
	let envConfigService: EnvConfig;
	let authService: AuthService;

	let sut: CheckEmailUseCase;

	beforeAll(async () => {
		initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

		module = await Test.createTestingModule({
			imports: [TypeOrmModule.forFeature([UserSchema]), configTypeOrmModule()],
		}).compile();

		typeOrmRepositoryUser = module.get<Repository<UserSchema>>(
			getRepositoryToken(UserSchema),
		);

		const dataSource = module.get<DataSource>(DataSource);

		addTransactionalDataSource(dataSource);

		userRepository = new UserTypeOrmRepository(
			typeOrmRepositoryUser,
			userTypeormRepositoryMapper,
		);
		jwtService = new JwtNestjsService(new NestJwtService());

		envConfigService = new EnvConfigService(new ConfigService());
		authService = new AuthAppJwtService(jwtService, envConfigService);
	});

	beforeEach(async () => {
		sut = new CheckEmailUseCase(
			envConfigService,
			jwtService,
			userRepository,
			authService,
		);
		await typeOrmRepositoryUser.clear();
	});

	afterAll(async () => {
		await module.close();
	});

	it('should check email and login', async () => {
		const userId = 'cd6393fd-2617-4bda-92d4-6b684010f80d';
		await typeOrmRepositoryUser.save({
			...UserDataBuilder({
				email: 'test@email.com',
				emailVerified: null,
				forgotPasswordEmailVerificationToken: null,
				active: false,
				phoneNumber: null,
			}),
			id: userId,
		});

		const { token } = await jwtService.generateJwt(
			{ sub: userId },
			{ expiresIn: 60, secret: envConfigService.getJwtActiveAccountSecret() },
		);

		const output = await sut.execute({
			checkEmailToken: token,
			setCookies: jest.fn(),
		});
		const user = await userRepository.getById(userId);
		expect(user.emailVerified).toBeInstanceOf(Date);
		expect(user.active).toBeTruthy();
		expect(output).toStrictEqual(user.toJSON());
	});
});
