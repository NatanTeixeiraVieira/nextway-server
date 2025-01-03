import { InvalidTokenError } from '@/shared/application/errors/invalid-token-error';
import { Controller, Get, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { InvalidTokenErrorFilter } from '../../invalid-token-error.filter';

@Controller('stub')
class StubController {
	@Get()
	index() {
		throw new InvalidTokenError('Invalid token provided');
	}
}

describe('InvalidTokenErrorFilter e2e tests', () => {
	let app: INestApplication;
	let module: TestingModule;

	beforeAll(async () => {
		module = await Test.createTestingModule({
			controllers: [StubController],
		}).compile();
		app = module.createNestApplication();
		app.useGlobalFilters(new InvalidTokenErrorFilter());
		await app.init();
	});

	it('should be defined', () => {
		expect(new InvalidTokenErrorFilter()).toBeDefined();
	});

	it('should catch a InvalidTokenError', () => {
		return request(app.getHttpServer()).get('/stub').expect(401).expect({
			statusCode: 401,
			error: 'Invalid Token Error',
			message: 'Invalid token provided',
		});
	});
});
