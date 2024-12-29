import { UserDataBuilder } from '@/core/user/domain/testing/helpers/user-data-builder';
import { configTypeOrmModule } from '@/shared/infra/database/typeorm/testing/config-typeorm-module-tests';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSchema } from '../../../schemas/user.schema';
import { UserTypeOrmQuery } from '../../user-typeorm.query';

describe('UserTypeOrmQuery integration tests', () => {
	let module: TestingModule;
	let userRepository: Repository<UserSchema>;
	let sut: UserTypeOrmQuery;

	beforeAll(async () => {
		module = await Test.createTestingModule({
			imports: [TypeOrmModule.forFeature([UserSchema]), configTypeOrmModule()],
		}).compile();

		userRepository = module.get<Repository<UserSchema>>(
			getRepositoryToken(UserSchema),
		);
	});

	beforeEach(async () => {
		sut = new UserTypeOrmQuery(userRepository);
		await userRepository.clear();
	});

	afterAll(async () => {
		await module.close();
	});

	it('should return false when user not found', async () => {
		const user = await sut.emailAccountActiveExists('teste@email.com');

		expect(user).toBeFalsy();
	});

	it('should return false when user exists by email and is disabled', async () => {
		const props: UserSchema = {
			...UserDataBuilder(),
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: null,
			email: 'teste@email.com',
			active: false,
			id: '561c23cb-73ba-4138-bada-704d5d49d0c3',
		};
		await userRepository.save(props);

		const user = await sut.emailAccountActiveExists('teste@email.com');

		expect(user).toBeFalsy();
	});

	it('should return true when user exists by email and is enabled', async () => {
		const props: UserSchema = {
			...UserDataBuilder(),
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: null,
			email: 'teste@email.com',
			active: true,
			id: '561c23cb-73ba-4138-bada-704d5d49d0c3',
		};
		await userRepository.save(props);

		const user = await sut.emailAccountActiveExists('teste@email.com');

		expect(user).toBeTruthy();
	});
});
