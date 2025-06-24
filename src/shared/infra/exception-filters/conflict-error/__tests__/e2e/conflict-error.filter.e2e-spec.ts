import { ConflictError } from '@/shared/application/errors/conflict-error';
import { Controller, Get, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { ConflictErrorFilter } from '../../conflict-error.filter';

@Controller('stub')
class StubController {
	@Get()
	index() {
		throw new ConflictError('Conflict error in application');
	}
}

describe('ConflictErrorFilter e2e tests', () => {
	let app: INestApplication;
	let module: TestingModule;

	beforeAll(async () => {
		module = await Test.createTestingModule({
			controllers: [StubController],
		}).compile();
		app = module.createNestApplication();
		app.useGlobalFilters(new ConflictErrorFilter());
		await app.init();
	});

	it('should be defined', () => {
		expect(new ConflictErrorFilter()).toBeDefined();
	});

	it('should catch a BadRequestError', () => {
		return request(app.getHttpServer()).get('/stub').expect(409).expect({
			statusCode: 409,
			error: 'Conflict Error',
			message: 'Conflict error in application',
		});
	});
});
