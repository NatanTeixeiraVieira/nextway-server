import { EntityValidationError } from '@/shared/domain/errors/validation-error';
import { Controller, Get, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { EntityValidationErrorFilter } from '../../entity-validation-error.filter';

@Controller('stub')
class StubController {
	@Get()
	index() {
		throw new EntityValidationError({
			email: ['Email should not be empty', 'Email should be an email'],
			password: ['Password should not be empty'],
		});
	}
}

describe('EntityValidationErrorFilter e2e tests', () => {
	let app: INestApplication;
	let module: TestingModule;

	beforeAll(async () => {
		module = await Test.createTestingModule({
			controllers: [StubController],
		}).compile();
		app = module.createNestApplication();
		app.useGlobalFilters(new EntityValidationErrorFilter());
		await app.init();
	});

	it('should be defined', () => {
		expect(new EntityValidationErrorFilter()).toBeDefined();
	});

	it('should catch a EntityValidationError', () => {
		return request(app.getHttpServer())
			.get('/stub')
			.expect(422)
			.expect({
				statusCode: 422,
				error: 'Unprocessable Entity',
				message: {
					email: ['Email should not be empty', 'Email should be an email'],
					password: ['Password should not be empty'],
				},
			});
	});
});
