import { UserSchema } from '@/core/user/infra/database/typeorm/schemas/user.schema';
import { appFastifyConfigTest } from '@/testing/app-config-test';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { DataSource, Repository } from 'typeorm';

describe('UserController recoverUserPasswordSendEmail e2e test', () => {
	let app: NestFastifyApplication;
	let dataSource: DataSource;
	let typeOrmUserRepository: Repository<UserSchema>;

	beforeAll(async () => {
		const { fastifyApp, module } = await appFastifyConfigTest();
		app = fastifyApp;

		dataSource = module.get<DataSource>(DataSource);
		typeOrmUserRepository = dataSource.getRepository(UserSchema);
	});

	beforeEach(async () => {
		await typeOrmUserRepository.clear();
	});

	afterAll(async () => {
		await app.close();
	});

	// TODO Config a local email server and create success test case
	it('should send an email to recover user password', async () => {});
});
