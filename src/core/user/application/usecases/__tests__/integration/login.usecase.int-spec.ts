import { UserRepository } from '@/core/user/domain/repositories/user.repository';
import { UserDataBuilder } from '@/core/user/domain/testing/helpers/user-data-builder';
import { UserTypeormRepositoryMapper } from '@/core/user/infra/database/typeorm/repositories/user-typeorm-repository-mapper';
import { UserTypeOrmRepository } from '@/core/user/infra/database/typeorm/repositories/user-typeorm.repository';
import { UserSchema } from '@/core/user/infra/database/typeorm/schemas/user.schema';
import { AuthService } from '@/shared/application/services/auth.service';
import { HashService } from '@/shared/application/services/hash.service';
import { configTypeOrmModule } from '@/shared/infra/database/typeorm/testing/config-typeorm-module-tests';
import { EnvConfigService } from '@/shared/infra/env-config/env-config.service';
import { AuthAppJwtService } from '@/shared/infra/services/auth-service/app-jwt-service/auth-app-jwt-service.service';
import { HashBcryptService } from '@/shared/infra/services/hash-service/bcrypt/hash-bcrypt.service';
import { JwtNestjsService } from '@/shared/infra/services/jwt-service/nestjs/jwt-nestjs.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { DataSource, Repository } from 'typeorm';
import {
	StorageDriver,
	addTransactionalDataSource,
	initializeTransactionalContext,
} from 'typeorm-transactional';
import { LoginUseCase } from '../../login.usecase';

describe('LoginUseCase integration tests', () => {
	const userTypeormRepositoryMapper = new UserTypeormRepositoryMapper();

	let typeOrmRepositoryUser: Repository<UserSchema>;
	let module: TestingModule;
	let userRepository: UserRepository;
	let hashService: HashService;
	let authService: AuthService;

	let sut: LoginUseCase;

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

		const envConfigService = new EnvConfigService(new ConfigService());

		userRepository = new UserTypeOrmRepository(
			typeOrmRepositoryUser,
			userTypeormRepositoryMapper,
		);

		hashService = new HashBcryptService(envConfigService);

		authService = new AuthAppJwtService(
			new JwtNestjsService(new JwtService()),
			envConfigService,
		);
	});

	beforeEach(async () => {
		sut = new LoginUseCase(userRepository, hashService, authService);
		await typeOrmRepositoryUser.clear();
	});

	afterAll(async () => {
		await module.close();
	});

	it('should do user login', async () => {
		const userId = 'cd6393fd-2617-4bda-92d4-6b684010f80d';
		const input = {
			email: 'test@email.com',
			password: 'test password',
			setCookies: jest.fn(),
		};

		await typeOrmRepositoryUser.save({
			...UserDataBuilder({
				password: await bcrypt.hash('test password', 2),
				email: 'test@email.com',
				emailVerified: new Date(),
				active: true,
			}),
			id: userId,
		});

		const output = await sut.execute(input);

		const user = await userRepository.getById(userId);
		expect(output).toStrictEqual(user?.toJSON());
	});
});
