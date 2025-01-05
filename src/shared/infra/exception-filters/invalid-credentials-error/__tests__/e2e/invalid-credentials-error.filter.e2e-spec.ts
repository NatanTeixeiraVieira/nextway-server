import { InvalidCredentialsError } from '@/shared/application/errors/invalid-credentials-error';
import { Controller, Get, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { InvalidCredentialsErrorFilter } from '../../invalid-credentials-error.filter';

@Controller('stub')
class StubController {
	@Get()
	index() {
		throw new InvalidCredentialsError('Invalid email or password provided');
	}
}

describe('InvalidCredentialsErrorFilter e2e tests', () => {
	let app: INestApplication;
	let module: TestingModule;

	beforeAll(async () => {
		module = await Test.createTestingModule({
			controllers: [StubController],
		}).compile();
		app = module.createNestApplication();
		app.useGlobalFilters(new InvalidCredentialsErrorFilter());
		await app.init();
	});

	it('should be defined', () => {
		expect(new InvalidCredentialsErrorFilter()).toBeDefined();
	});

	it('should catch a InvalidCredentialsErrorFilter', () => {
		return request(app.getHttpServer()).get('/stub').expect(422).expect({
			statusCode: 422,
			error: 'Invalid Credentials Error',
			message: 'Invalid email or password provided',
		});
	});
});
