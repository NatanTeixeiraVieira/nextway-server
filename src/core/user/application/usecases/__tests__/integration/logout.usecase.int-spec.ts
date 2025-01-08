import { AuthService } from '@/shared/application/services/auth.service';
import { EnvConfigService } from '@/shared/infra/env-config/env-config.service';
import { AuthAppJwtService } from '@/shared/infra/services/auth-service/app-jwt-service/auth-app-jwt-service.service';
import { JwtNestjsService } from '@/shared/infra/services/jwt-service/nestjs/jwt-nestjs.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LogoutUseCase } from '../../logout.usecase';

describe('LogoutUseCase integration tests', () => {
	let sut: LogoutUseCase;
	let authService: AuthService;

	beforeEach(() => {
		sut = new LogoutUseCase(
			new AuthAppJwtService(
				new JwtNestjsService(new JwtService()),
				new EnvConfigService(new ConfigService()),
			),
		);
	});

	it('should clear cookies', async () => {
		const clearCookies = jest.fn();
		const output = await sut.execute({ clearCookies });

		expect(clearCookies).toHaveBeenCalledTimes(2);
		expect(output).toBeUndefined();
	});
});
