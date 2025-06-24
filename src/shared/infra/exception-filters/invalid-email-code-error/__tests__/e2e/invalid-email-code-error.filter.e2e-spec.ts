import { InvalidEmailCodeError } from '@/shared/application/errors/invalid-email-code-error';
import { Controller, Get, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { InvalidEmailCodeErrorFilter } from '../../invalid-email-code-error.filter';

@Controller('stub')
class StubController {
	@Get()
	index() {
		throw new InvalidEmailCodeError('Invalid email code');
	}
}

describe('InvalidEmailCodeErrorFilter e2e tests', () => {
	let app: INestApplication;
	let module: TestingModule;

	beforeAll(async () => {
		module = await Test.createTestingModule({
			controllers: [StubController],
		}).compile();
		app = module.createNestApplication();
		app.useGlobalFilters(new InvalidEmailCodeErrorFilter());
		await app.init();
	});

	it('should be defined', () => {
		expect(new InvalidEmailCodeErrorFilter()).toBeDefined();
	});

	it('should catch a InvalidEmailCodeErrorFilter', () => {
		return request(app.getHttpServer()).get('/stub').expect(400).expect({
			statusCode: 400,
			error: 'Invalid Email Error',
			message: 'Invalid email code',
		});
	});
});
