import { UserRepository } from '@/core/user/domain/repositories/user.repository';
import { UserDataBuilder } from '@/core/user/domain/testing/helpers/user-data-builder';
import { UserTypeOrmQuery } from '@/core/user/infra/database/typeorm/queries/user-typeorm.query';
import { UserTypeormRepositoryMapper } from '@/core/user/infra/database/typeorm/repositories/user-typeorm-repository-mapper';
import { UserTypeOrmRepository } from '@/core/user/infra/database/typeorm/repositories/user-typeorm.repository';
import { UserSchema } from '@/core/user/infra/database/typeorm/schemas/user.schema';
import { EnvConfig } from '@/shared/application/env-config/env-config';
import { HashService } from '@/shared/application/services/hash.service';
import { JwtService } from '@/shared/application/services/jwt.service';
import { MailService } from '@/shared/application/services/mail.service';
import { configTypeOrmModule } from '@/shared/infra/database/typeorm/testing/config-typeorm-module-tests';
import { EnvConfigService } from '@/shared/infra/env-config/env-config.service';
import { HashBcryptService } from '@/shared/infra/services/hash-service/bcrypt/hash-bcrypt.service';
import { JwtNestjsService } from '@/shared/infra/services/jwt-service/nestjs/jwt-nestjs.service';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { DataSource, Repository } from 'typeorm';
import {
	addTransactionalDataSource,
	initializeTransactionalContext,
	StorageDriver,
} from 'typeorm-transactional';
import { UserOutputMapper } from '../../../outputs/user-output';
import { UserQuery } from '../../../queries/user.query';
import { RegisterUseCase } from '../../register.usecase';

describe('RegisterUseCase integration tests', () => {
	const userTypeormRepositoryMapper = new UserTypeormRepositoryMapper();
	let typeOrmRepositoryUser: Repository<UserSchema>;
	let module: TestingModule;
	let userRepository: UserRepository;
	let userQuery: UserQuery;
	let hashService: HashService;
	let mailService: MailService;
	let jwtService: JwtService;
	let envConfigService: EnvConfig;
	let userOutputMapper: UserOutputMapper;

	let sut: RegisterUseCase;

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
		userQuery = new UserTypeOrmQuery(typeOrmRepositoryUser);
		envConfigService = new EnvConfigService(new ConfigService());
		hashService = new HashBcryptService(envConfigService);
		mailService = {
			sendMail: jest.fn(),
		} as unknown as MailService;

		jwtService = new JwtNestjsService(new NestJwtService());
		userOutputMapper = new UserOutputMapper();
	});

	beforeEach(async () => {
		sut = new RegisterUseCase(
			userRepository,
			userQuery,
			hashService,
			mailService,
			jwtService,
			envConfigService,
			userOutputMapper,
		);
		await typeOrmRepositoryUser.clear();
	});

	afterAll(async () => {
		await module.close();
	});

	it('should register a non-existent user', async () => {
		const input = {
			email: 'test@email.com',
			name: 'Test',
			password: '12345678',
		};

		const output = await sut.execute(input);

		const user = await typeOrmRepositoryUser.findOneBy({ id: output.id });

		expect(output.id).toBeTruthy();
		expect(typeof output.id).toBe('string');
		expect(output.active).toBeFalsy();
		expect(output.audit.createdAt).toBeInstanceOf(Date);
		expect(output.audit.updatedAt).toBeInstanceOf(Date);
		expect(output.audit.deletedAt).toBeNull();
		expect(output.email).toBe(input.email);
		expect(output.emailVerified).toBeFalsy();
		expect(output.forgotPasswordEmailVerificationToken).toBeNull();
		expect(output.name).toBe(input.name);
		expect(output.password).toBeTruthy();
		expect(output.password).not.toBe(input.password);
		const isPasswordValid = await bcrypt.compare(
			input.password,
			output.password,
		);
		expect(isPasswordValid).toBe(true);
		expect(output.phoneNumber).toBeNull();

		expect(user.id).toBeTruthy();
		expect(typeof user.id).toBe('string');
		expect(user.active).toBeFalsy();
		expect(user.createdAt).toBeInstanceOf(Date);
		expect(user.updatedAt).toBeInstanceOf(Date);
		expect(user.deletedAt).toBeNull();
		expect(user.email).toBe(input.email);
		expect(user.emailVerified).toBeFalsy();
		expect(user.forgotPasswordEmailVerificationToken).toBeNull();
		expect(user.name).toBe(input.name);
		expect(user.password).toBeTruthy();
		expect(user.password).not.toBe(input.password);
		const isDbUserPasswordValid = await bcrypt.compare(
			input.password,
			user.password,
		);
		expect(isDbUserPasswordValid).toBe(true);
		expect(user.phoneNumber).toBeNull();
	});

	it('should register a existent user', async () => {
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

		const input = {
			email: 'test@email.com',
			name: 'Test',
			password: '12345678',
		};

		const output = await sut.execute(input);

		const allUsers = await typeOrmRepositoryUser.findBy({ id: userId });
		const user = allUsers[0];

		expect(allUsers.length).toBe(1);
		expect(output.id).toBeTruthy();
		expect(typeof output.id).toBe('string');

		expect(output.active).toBeFalsy();
		expect(output.audit.createdAt).toBeInstanceOf(Date);
		expect(output.audit.updatedAt).toBeInstanceOf(Date);
		expect(output.audit.deletedAt).toBeNull();
		expect(output.email).toBe(input.email);
		expect(output.emailVerified).toBeFalsy();
		expect(output.forgotPasswordEmailVerificationToken).toBeNull();
		expect(output.name).toBe(input.name);
		expect(output.password).toBeTruthy();
		expect(output.password).not.toBe(input.password);
		const isPasswordValid = await bcrypt.compare(
			input.password,
			output.password,
		);
		expect(isPasswordValid).toBeTruthy();
		expect(output.phoneNumber).toBeNull();

		expect(user.id).toBeTruthy();
		expect(typeof user.id).toBe('string');
		expect(user.active).toBeFalsy();
		expect(user.createdAt).toBeInstanceOf(Date);
		expect(user.updatedAt).toBeInstanceOf(Date);
		expect(user.deletedAt).toBeNull();
		expect(user.email).toBe(input.email);
		expect(user.emailVerified).toBeFalsy();
		expect(user.forgotPasswordEmailVerificationToken).toBeNull();
		expect(user.name).toBe(input.name);
		expect(user.password).toBeTruthy();
		expect(user.password).not.toBe(input.password);
		const isDbUserPasswordValid = await bcrypt.compare(
			input.password,
			user.password,
		);
		expect(isDbUserPasswordValid).toBe(true);
		expect(user.phoneNumber).toBeNull();
	});
});
