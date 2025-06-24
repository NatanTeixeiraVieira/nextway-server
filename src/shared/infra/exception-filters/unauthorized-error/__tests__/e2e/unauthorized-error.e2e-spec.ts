import { UnauthorizedError } from '@/shared/application/errors/unauthorized-error';
import { Controller, Get, HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { UnauthorizedErrorFilter } from '../../unauthorized-error.filter';

@Controller('stub')
class StubController {
	@Get()
	index() {
		throw new UnauthorizedError('Unauthorized access');
	}
}

describe('UnauthorizedErrorFilter e2e tests', () => {
	let app: INestApplication;
	let module: TestingModule;

	beforeAll(async () => {
		module = await Test.createTestingModule({
			controllers: [StubController],
		}).compile();
		app = module.createNestApplication();
		app.useGlobalFilters(new UnauthorizedErrorFilter());
		await app.init();
	});

	it('should be defined', () => {
		expect(new UnauthorizedErrorFilter()).toBeDefined();
	});

	it('should catch a UnauthorizedErrorFilter', () => {
		return request(app.getHttpServer())
			.get('/stub')
			.expect(HttpStatus.UNAUTHORIZED)
			.expect({
				statusCode: HttpStatus.UNAUTHORIZED,
				error: 'Unauthorized Error',
				message: 'Unauthorized access',
			});
	});
});
