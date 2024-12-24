import { User, UserProps } from '@/core/user/domain/entities/user.entity';
import { UserDataBuilder } from '@/core/user/domain/testing/helpers/user-data-builder';
import { EntityProps } from '@/shared/domain/entities/entity';
import { configTypeOrmModule } from '@/shared/infra/database/typeorm/testing/config-typeorm-module-tests';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSchema } from '../../../schemas/user.schema';
import { UserTypeormRepositoryMapper } from '../../user-typeorm-repository-mapper';
import { UserTypeOrmRepository } from '../../user-typeorm.repository';

describe('UserTypeOrmRepository integration tests', () => {
	const userTypeormRepositoryMapper = new UserTypeormRepositoryMapper();
	let module: TestingModule;
	let userRepository: Repository<UserSchema>;
	let sut: UserTypeOrmRepository;

	beforeAll(async () => {
		module = await Test.createTestingModule({
			imports: [TypeOrmModule.forFeature([UserSchema]), configTypeOrmModule()],
		}).compile();

		userRepository = module.get<Repository<UserSchema>>(
			getRepositoryToken(UserSchema),
		);
	});

	beforeEach(async () => {
		sut = new UserTypeOrmRepository(
			userRepository,
			userTypeormRepositoryMapper,
		);
		await userRepository.clear();
	});

	it('should return null when user not found', async () => {
		const user = await sut.findById('561c23cb-73ba-4138-bada-704d5d49d0c3');

		expect(user).toBeNull();
	});

	it('should find user by id', async () => {
		const props: UserSchema = {
			...UserDataBuilder(),
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: null,
			id: '561c23cb-73ba-4138-bada-704d5d49d0c3',
		};
		await userRepository.save(props);

		const user = await sut.findById(props.id);

		expect(user).not.toBeNull();
		expect(user.toJSON()).toStrictEqual({
			id: props.id,
			name: props.name,
			email: props.email,
			password: props.password,
			audit: {
				createdAt: props.createdAt,
				updatedAt: props.updatedAt,
				deletedAt: props.deletedAt,
			},
			active: props.active,
			emailVerified: props.emailVerified,
			phoneNumber: props.phoneNumber,
			forgotPasswordEmailVerificationToken:
				props.forgotPasswordEmailVerificationToken,
		});
	});

	it('should create user', async () => {
		const props: UserProps & EntityProps = {
			...UserDataBuilder(),
			audit: {
				createdAt: new Date(),
				updatedAt: new Date(),
				deletedAt: null,
			},
			id: '561c23cb-73ba-4138-bada-704d5d49d0c3',
		};
		const entity = User.with(props);
		await sut.create(entity);

		const { createdAt, updatedAt, deletedAt, ...userEntity } =
			await userRepository.findOneBy({ id: entity.id });

		expect(userEntity).toBeTruthy();
		expect({
			...userEntity,
			audit: {
				createdAt,
				updatedAt,
				deletedAt,
			},
		}).toStrictEqual(entity.toJSON());
	});

	it('should update user', async () => {
		const props: UserSchema = {
			...UserDataBuilder(),
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: null,
			id: '561c23cb-73ba-4138-bada-704d5d49d0c3',
		};
		await userRepository.save(props);

		const updatedUserProps: UserProps & EntityProps = {
			...UserDataBuilder(),
			audit: {
				createdAt: new Date(),
				updatedAt: new Date(),
				deletedAt: null,
			},
			id: props.id,
			name: 'new name',
		};

		const user = User.with(updatedUserProps);

		await sut.update(user);

		const { createdAt, updatedAt, deletedAt, ...updatedUserEntity } =
			await userRepository.findOneBy({ id: props.id });

		expect(updatedUserEntity).toBeTruthy();
		expect(updatedUserEntity!.name).toBe('new name');
		expect({
			...updatedUserEntity,
			audit: {
				createdAt,
				updatedAt,
				deletedAt,
			},
		}).toStrictEqual(user.toJSON());
	});

	it('should delete user', async () => {
		const props: UserSchema = {
			...UserDataBuilder(),
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: null,
			id: '561c23cb-73ba-4138-bada-704d5d49d0c3',
		};
		await userRepository.save(props);

		const { createdAt, updatedAt, deletedAt, ...entityProps } = props;
		const user = User.with({
			...entityProps,
			audit: {
				createdAt,
				updatedAt,
				deletedAt,
			},
		});

		await sut.delete(user);

		const deletedUser = await userRepository.findOne({
			where: { id: props.id },
		});
		expect(deletedUser).toBeNull();

		const userAfterDelete = await sut.findById(props.id);
		expect(userAfterDelete).toBeNull();

		const deletedUserNotNull = await userRepository.findOne({
			where: { id: props.id },
			withDeleted: true,
		});
		expect(deletedUserNotNull.deletedAt).toBeInstanceOf(Date);
	});
});
