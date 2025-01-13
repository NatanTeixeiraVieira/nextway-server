import { User } from '@/core/user/domain/entities/user.entity';
import { UserDataBuilder } from '@/core/user/domain/testing/helpers/user-data-builder';
import { UserSchema } from '@/core/user/infra/database/typeorm/schemas/user.schema';
import { Providers } from '@/shared/application/constants/providers';
import { AuthService } from '@/shared/application/services/auth.service';
import { LoggedUserService } from '@/shared/application/services/logged-user.service';
import { configTypeOrmModule } from '@/shared/infra/database/typeorm/testing/config-typeorm-module-tests';
import { AuthServiceModule } from '@/shared/infra/services/auth-service/auth-service.module';
import { LoggedUserModule } from '@/shared/infra/services/logged-user/logged-user.module';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
	StorageDriver,
	addTransactionalDataSource,
	initializeTransactionalContext,
} from 'typeorm-transactional';
import { RefreshTokenUseCase } from '../../refresh-token.usecase';

describe('RefreshTokenUseCase integration tests', () => {
	let sut: RefreshTokenUseCase;

	let module: TestingModule;
	let authService: AuthService;
	let loggedUserService: LoggedUserService;

	beforeAll(async () => {
		initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

		module = await Test.createTestingModule({
			imports: [
				TypeOrmModule.forFeature([UserSchema]),
				configTypeOrmModule(),
				AuthServiceModule,
				LoggedUserModule,
			],
		}).compile();

		const dataSource = module.get<DataSource>(DataSource);

		authService = module.get(Providers.AUTH_SERVICE);
		loggedUserService = await module.resolve(Providers.LOGGED_USER_SERVICE);

		addTransactionalDataSource(dataSource);
	});

	beforeEach(() => {
		sut = new RefreshTokenUseCase(authService, loggedUserService);
		loggedUserService.setLoggedUser(
			User.with({
				...UserDataBuilder(),
				id: '33d4d4c5-3583-4461-aee5-a42040800801',
				audit: {
					createdAt: new Date(),
					updatedAt: new Date(),
					deletedAt: null,
				},
			}),
		);
	});

	it('should refresh user token', async () => {
		const setCookies = jest.fn();
		await sut.execute({ setCookies });

		expect.assertions(0);
	});
});
