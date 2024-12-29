import { Controller, Get, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { GlobalErrorFilter } from '../../global-error.filter';

@Controller('stub')
class StubController {
	@Get()
	index() {
		throw new Error('Some error occurred');
	}
}

describe('GlobalErrorFilter e2e tests', () => {
	let app: INestApplication;
	let module: TestingModule;

	beforeAll(async () => {
		module = await Test.createTestingModule({
			controllers: [StubController],
		}).compile();
		app = module.createNestApplication();
		app.useGlobalFilters(new GlobalErrorFilter());
		await app.init();
	});

	it('should be defined', () => {
		expect(new GlobalErrorFilter()).toBeDefined();
	});

	it('should catch a BadRequestError', () => {
		return request(app.getHttpServer()).get('/stub').expect(500).expect({
			statusCode: 500,
			error: 'Internal Server Error',
			message: 'Some error occurred',
		});
	});
});
