import { UserSchema } from '@/core/user/infra/database/typeorm/schemas/user.schema';
import { UserModule } from '@/core/user/infra/user.module';
import { Providers } from '@/shared/application/constants/providers';
import { EnvConfig } from '@/shared/application/env-config/env-config';
import { JwtService } from '@/shared/application/services/jwt.service';
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
import { VerifyRecoverPasswordTokenUseCase } from '../../verify-recover-password-token.usecase';

describe('VerifyRecoverPasswordTokenUseCase integration tests', () => {
	let sut: VerifyRecoverPasswordTokenUseCase;
	let envConfigService: EnvConfig;
	let jwtService: JwtService;
	let module: TestingModule;
	let typeOrmRepositoryUser: Repository<UserSchema>;
	let uow: UnitOfWork;

	beforeAll(async () => {
		initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

		module = await Test.createTestingModule({
			imports: [
				TypeOrmModule.forFeature([UserSchema]),
				configTypeOrmModule(),
				UserModule,
				UnitOfWorkModule,
			],
		}).compile();

		const dataSource = module.get<DataSource>(DataSource);

		addTransactionalDataSource(dataSource);

		typeOrmRepositoryUser = module.get<Repository<UserSchema>>(
			getRepositoryToken(UserSchema),
		);
		uow = module.get(Providers.UNIT_OF_WORK);

		jwtService = module.get(Providers.JWT_SERVICE);
		envConfigService = module.get(Providers.ENV_CONFIG_SERVICE);
	});

	beforeEach(() => {
		sut = module.get(VerifyRecoverPasswordTokenUseCase);
	});

	afterAll(async () => {
		await module.close();
	});

	it('should return false when token is invalid', async () => {
		const { token } = await jwtService.generateJwt(
			{
				sub: 'test',
				email: 'email@test.com',
			},
			{
				expiresIn: 100,
				secret: 'invalid_secret',
			},
		);
		const output = await sut.execute({ token });

		expect(output).toStrictEqual({ isValid: false });
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
		const output = await sut.execute({ token });

		expect(output).toStrictEqual({ isValid: true });
	});
});
