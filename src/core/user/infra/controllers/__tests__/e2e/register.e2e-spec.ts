import { appFastifyConfigTest } from '@/core/tenant/domain/testing/app-config-test';
import { UserProviders } from '@/core/user/application/constants/providers';
import { UserRepository } from '@/core/user/domain/repositories/user.repository';
import { UserDataBuilder } from '@/core/user/domain/testing/helpers/user-data-builder';
import { ErrorMessages } from '@/shared/application/error-messages/error-messages';
import { Mutable } from '@/shared/application/types/utils';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import request from 'supertest';
import { DataSource, Repository } from 'typeorm';
import { UserSchema } from '../../../database/typeorm/schemas/user.schema';
import { RegisterDto } from '../../../dtos/register.dto';

describe('UserController registerUser e2e tests', () => {
	let app: NestFastifyApplication;
	let dataSource: DataSource;
	let typeOrmUserRepository: Repository<UserSchema>;
	let userRepository: UserRepository;
	let registerDto: Partial<Mutable<RegisterDto>>;

	beforeAll(async () => {
		const { fastifyApp, module } = await appFastifyConfigTest();
		app = fastifyApp;

		dataSource = module.get<DataSource>(DataSource);
		typeOrmUserRepository = dataSource.getRepository(UserSchema);
		userRepository = module.get<UserRepository>(UserProviders.USER_REPOSITORY);
	});

	afterAll(async () => {
		await app.close();
	});

	beforeEach(async () => {
		registerDto = {
			email: 'test@email.com',
			name: 'Test User',
			password: '12345678',
		};
		await typeOrmUserRepository.clear();
	});

	// TODO Config a local email server to run this test

	// it('should register a non-existent user', async () => {
	// 	const response = await request(app.getHttpServer())
	// 		.post('/api/user/v1/register')
	// 		.send(registerDto)
	// 		.expect(201);

	// 	const output = response.body;
	// 	const user = await userRepository.findById(output.id);

	// 	expect(output.id).toBeTruthy();
	// 	expect(typeof output.id).toBe('string');
	// 	expect(output.password).toBeUndefined();

	// 	expect(user).toBeDefined();
	// 	expect(user.id).toBe(output.id);
	// 	expect(user.email).toBe(registerDto.email);
	// 	expect(user.name).toBe(registerDto.name);
	// 	expect(user.active).toBeFalsy();
	// 	expect(user.emailVerified).toBeFalsy();
	// 	expect(user.forgotPasswordEmailVerificationToken).toBeNull();
	// 	const isPasswordValid = await bcrypt.compare(
	// 		registerDto.password,
	// 		user.password,
	// 	);
	// 	expect(isPasswordValid).toBeTruthy();

	// 	const presenter = new RegisterPresenter(user.toJSON());
	// 	const serialized = instanceToPlain(presenter);
	// 	expect(output).toStrictEqual(serialized);
	// });

	// TODO Config a local email server to run this test

	// it('should register an existent user', async () => {
	// 	const userId = 'cd6393fd-2617-4bda-92d4-6b684010f80d';
	// 	await typeOrmUserRepository.save({
	// 		...UserDataBuilder({
	// 			email: registerDto.email,
	// 			emailVerified: null,
	// 			forgotPasswordEmailVerificationToken: null,
	// 			active: false,
	// 			phoneNumber: null,
	// 		}),
	// 		id: userId,
	// 	});

	// 	const response = await request(app.getHttpServer())
	// 		.post('/api/user/v1/register')
	// 		.send(registerDto)
	// 		.expect(201);

	// 	const output = response.body;
	// 	const user = await userRepository.getByEmail('test@email.com');

	// 	expect(output.id).toBeTruthy();
	// 	expect(typeof output.id).toBe('string');
	// 	expect(output.password).toBeUndefined();

	// 	expect(user).toBeDefined();
	// 	expect(user.id).toBe(output.id);
	// 	expect(user.email).toBe(registerDto.email);
	// 	expect(user.name).toBe(registerDto.name);
	// 	expect(user.active).toBeFalsy();
	// 	expect(user.emailVerified).toBeFalsy();
	// 	expect(user.forgotPasswordEmailVerificationToken).toBeNull();
	// 	const isPasswordValid = await bcrypt.compare(
	// 		registerDto.password,
	// 		user.password,
	// 	);
	// 	expect(isPasswordValid).toBeTruthy();

	// 	const presenter = new RegisterPresenter(user.toJSON());
	// 	const serialized = instanceToPlain(presenter);
	// 	expect(output).toStrictEqual(serialized);
	// });

	it('should throw error with status code 400 when email is not provided', async () => {
		delete registerDto.email;

		const response = await request(app.getHttpServer())
			.post('/api/user/v1/register')
			.send(registerDto)
			.expect(400);

		expect(response.statusCode).toBe(400);
		expect(response.body).toStrictEqual({
			statusCode: 400,
			error: 'Bad Request Error',
			message: ErrorMessages.EMAIL_NOT_INFORMED,
		});

		const user = await typeOrmUserRepository.findOneBy({
			name: registerDto.name,
		});

		expect(user).toBeNull();
	});

	it('should throw error with status code 400 when name is not provided', async () => {
		delete registerDto.name;

		const response = await request(app.getHttpServer())
			.post('/api/user/v1/register')
			.send(registerDto)
			.expect(400);

		expect(response.body).toStrictEqual({
			statusCode: 400,
			error: 'Bad Request Error',
			message: ErrorMessages.NAME_NOT_INFORMED,
		});

		const user = await typeOrmUserRepository.findOneBy({
			email: registerDto.email,
		});

		expect(user).toBeNull();
	});

	it('should throw error with status code 422 when password is not provided', async () => {
		delete registerDto.password;

		const response = await request(app.getHttpServer())
			.post('/api/user/v1/register')
			.send(registerDto)
			.expect(422);

		expect(response.body).toStrictEqual({
			error: 'Unprocessable Entity',
			message: ['password must be longer than or equal to 8 characters'],
			statusCode: 422,
		});

		const user = await typeOrmUserRepository.findOneBy({
			email: registerDto.email,
		});

		expect(user).toBeNull();
	});

	it('should throw error with status code 422 when password is shorter that 8 character', async () => {
		registerDto.password = '1234567';

		const response = await request(app.getHttpServer())
			.post('/api/user/v1/register')
			.send(registerDto)
			.expect(422);

		expect(response.body).toStrictEqual({
			error: 'Unprocessable Entity',
			message: ['password must be longer than or equal to 8 characters'],
			statusCode: 422,
		});

		const user = await typeOrmUserRepository.findOneBy({
			email: registerDto.email,
		});

		expect(user).toBeNull();
	});

	it('should throw error with status code 400 when email already exists and account is active ', async () => {
		const userEntity = UserSchema.with({
			...UserDataBuilder({ email: registerDto.email, active: true }),
			id: '029d912d-3fd4-4a96-8811-dd816c120bc8',
			audit: {
				createdAt: new Date(),
				updatedAt: new Date(),
				deletedAt: null as Date | null,
			},
		});
		await typeOrmUserRepository.save(userEntity);

		const response = await request(app.getHttpServer())
			.post('/api/user/v1/register')
			.send(registerDto)
			.expect(400);

		expect(response.body).toStrictEqual({
			statusCode: 400,
			error: 'Bad Request Error',
			message: ErrorMessages.EMAIL_ALREADY_EXISTS,
		});

		const user = await typeOrmUserRepository.findBy({
			email: registerDto.email,
		});

		expect(user.length).toBe(1);
	});

	it('should throw entity error with status code 422 when email is invalid', async () => {
		registerDto.email = 'test@email';

		const response = await request(app.getHttpServer())
			.post('/api/user/v1/register')
			.send(registerDto)
			.expect(422);

		expect(response.body).toStrictEqual({
			statusCode: 422,
			error: 'Unprocessable Entity',
			message: {
				email: ['email must be an email'],
			},
		});

		const user = await typeOrmUserRepository.findOneBy({
			email: registerDto.email,
		});

		expect(user).toBeNull();
	});

	it('should throw entity error with status code 422 when name is invalid', async () => {
		registerDto.name = 'a'.repeat(256);

		const response = await request(app.getHttpServer())
			.post('/api/user/v1/register')
			.send(registerDto)
			.expect(422);

		expect(response.body).toStrictEqual({
			statusCode: 422,
			error: 'Unprocessable Entity',
			message: {
				name: ['name must be shorter than or equal to 255 characters'],
			},
		});

		const user = await typeOrmUserRepository.findOneBy({
			email: registerDto.email,
		});

		expect(user).toBeNull();
	});
});
