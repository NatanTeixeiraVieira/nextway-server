import { UserProviders } from '@/core/user/application/constants/providers';
import { UserOutputMapper } from '@/core/user/application/outputs/user-output';
import { UserRepository } from '@/core/user/domain/repositories/user.repository';
import { UserDataBuilder } from '@/core/user/domain/testing/helpers/user-data-builder';
import { UserSchema } from '@/core/user/infra/database/typeorm/schemas/user.schema';
import { UserModule } from '@/core/user/infra/user.module';
import { Providers } from '@/shared/application/constants/providers';
import { EnvConfig } from '@/shared/application/env-config/env-config';
import { JwtService } from '@/shared/application/services/jwt.service';
import { MailService } from '@/shared/application/services/mail.service';
import { UnitOfWork } from '@/shared/application/unit-of-work/unit-of-work';
import { configTypeOrmModule } from '@/shared/infra/database/typeorm/testing/config-typeorm-module-tests';
import { UnitOfWorkModule } from '@/shared/infra/unit-of-work/unit-of-work.module';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
	addTransactionalDataSource,
	initializeTransactionalContext,
	StorageDriver,
} from 'typeorm-transactional';
import { SendPasswordRecoveryEmailUseCase } from '../../send-password-recovery-email.usecase';

describe('SendPasswordRecoveryEmailUseCase integration tests', () => {
	let typeOrmRepositoryUser: Repository<UserSchema>;
	let module: TestingModule;
	let userRepository: UserRepository;
	let mailService: MailService;
	let jwtService: JwtService;
	let envConfigService: EnvConfig;
	let userOutputMapper: UserOutputMapper;
	let uow: UnitOfWork;

	let sut: SendPasswordRecoveryEmailUseCase;

	beforeAll(async () => {
		initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

		module = await Test.createTestingModule({
			imports: [
				TypeOrmModule.forFeature([UserSchema]),
				UnitOfWorkModule,
				configTypeOrmModule(),
				UserModule,
			],
		}).compile();

		const dataSource = module.get<DataSource>(DataSource);

		addTransactionalDataSource(dataSource);

		typeOrmRepositoryUser = module.get<Repository<UserSchema>>(
			getRepositoryToken(UserSchema),
		);

		userRepository = module.get(UserProviders.USER_REPOSITORY);
		mailService = {
			sendMail: jest.fn(),
		};
		uow = module.get(Providers.UNIT_OF_WORK);
		jwtService = module.get(Providers.JWT_SERVICE);
		envConfigService = module.get(Providers.ENV_CONFIG_SERVICE);
		userOutputMapper = module.get(UserProviders.USER_OUTPUT_MAPPER);
	});

	beforeEach(async () => {
		sut = new SendPasswordRecoveryEmailUseCase(
			uow,
			userRepository,
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

	it('should send an email with the recover password token', async () => {
		await typeOrmRepositoryUser.save({
			...UserDataBuilder({
				active: true,
				email: 'test@email.com',
			}),
			id: 'cd6393fd-2617-4bda-92d4-6b684010f80d',
		});
		const output = await sut.execute({ email: 'test@email.com' });

		expect(output).toBeDefined();
		expect(output.email).toBe('test@email.com');
	});
});
