import { User, UserProps } from '@/core/user/domain/entities/user.entity';
import { UserDataBuilder } from '@/core/user/domain/testing/helpers/user-data-builder';
import { EntityProps } from '@/shared/domain/entities/entity';
import { configTypeOrmModule } from '@/shared/infra/database/typeorm/testing/config-typeorm-module-tests';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSchema } from '../../../schemas/user.schema';
import { UserTypeormRepositoryMapper } from '../../user-typeorm-repository-mapper';

describe('UserTypeormRepositoryMapper integration tests', () => {
	let module: TestingModule;
	let userRepository: Repository<UserSchema>;
	let sut: UserTypeormRepositoryMapper;

	beforeAll(async () => {
		module = await Test.createTestingModule({
			imports: [TypeOrmModule.forFeature([UserSchema]), configTypeOrmModule()],
		}).compile();

		userRepository = module.get<Repository<UserSchema>>(
			getRepositoryToken(UserSchema),
		);
	});

	beforeEach(async () => {
		sut = new UserTypeormRepositoryMapper();
		await userRepository.clear();
	});

	it('should map schema to entity', () => {
		const props: UserSchema = {
			...UserDataBuilder(),
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: null,
			id: '561c23cb-73ba-4138-bada-704d5d49d0c3',
		};
		const schema = userRepository.create(props);

		const entity = sut.toEntity(schema);

		expect(entity).toBeInstanceOf(User);
		expect(entity.toJSON()).toStrictEqual({
			id: schema.id,
			name: schema.name,
			email: schema.email,
			password: schema.password,
			audit: {
				createdAt: schema.createdAt,
				updatedAt: schema.updatedAt,
				deletedAt: schema.deletedAt,
			},
			active: schema.active,
			emailVerified: schema.emailVerified,
			phoneNumber: schema.phoneNumber,
			forgotPasswordEmailVerificationToken:
				schema.forgotPasswordEmailVerificationToken,
		});
	});

	it('should map entity to schema', () => {
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

		const schema = sut.toSchema(entity);

		expect(schema).toStrictEqual({
			id: entity.id,
			name: entity.name,
			email: entity.email,
			password: entity.password,
			createdAt: entity.audit.createdAt,
			updatedAt: entity.audit.updatedAt,
			deletedAt: entity.audit.deletedAt,
			active: entity.active,
			emailVerified: entity.emailVerified,
			phoneNumber: entity.phoneNumber,
			forgotPasswordEmailVerificationToken:
				entity.forgotPasswordEmailVerificationToken,
		});
	});
});
