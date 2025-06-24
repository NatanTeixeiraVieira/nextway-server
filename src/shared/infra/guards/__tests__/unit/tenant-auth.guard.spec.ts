import { TenantCookiesName } from '@/shared/application/constants/cookies';
import { EnvConfig } from '@/shared/application/env-config/env-config';
import { ErrorMessages } from '@/shared/application/error-messages/error-messages';
import { UnauthorizedError } from '@/shared/application/errors/unauthorized-error';
import { AuthenticatePayload } from '@/shared/application/services/auth.service';
import { JwtService } from '@/shared/application/services/jwt.service';
import { LoggedTenantService } from '@/shared/application/services/logged-tenant.service';
import { ExecutionContext } from '@nestjs/common';
import { TenantAuthGuard } from '../../tenant-auth.guard';

function createMockExecutionContext(cookieValue: any): ExecutionContext {
	return {
		switchToHttp: () => ({
			getRequest: () => ({
				cookies: {
					[TenantCookiesName.ACCESS_TOKEN]: cookieValue,
				},
			}),
		}),
	} as unknown as ExecutionContext;
}

describe('TenantAuthGuard unit tests', () => {
	let sut: TenantAuthGuard;
	let envConfigService: EnvConfig;
	let jwtService: JwtService;
	let loggedTenantService: LoggedTenantService;
	let context: ExecutionContext;
	let payload: AuthenticatePayload;

	beforeEach(() => {
		envConfigService = {
			getJwtSecret: jest.fn().mockReturnValue('mockJwtSecret'),
		} as unknown as EnvConfig;

		context = createMockExecutionContext('validToken');

		payload = {
			sub: 'mockSub',
			email: 'tenant@email.com',
		};

		jwtService = {
			verifyJwt: jest.fn().mockResolvedValue(true),
			decodeJwt: jest.fn().mockResolvedValue(payload),
		} as unknown as JwtService;

		loggedTenantService = {
			setLoggedTenant: jest.fn(),
		} as unknown as LoggedTenantService;

		sut = new TenantAuthGuard(
			jwtService,
			loggedTenantService,
			envConfigService,
		);
	});

	it('should be defined', () => {
		expect(sut).toBeDefined();
	});

	it('should throw an error if no access token is provided', async () => {
		context = createMockExecutionContext(null);
		await expect(sut.canActivate(context)).rejects.toThrow(
			new UnauthorizedError(ErrorMessages.INVALID_TOKEN),
		);
	});

	it('should throw an error if access token is invalid', async () => {
		(jwtService.verifyJwt as jest.Mock).mockResolvedValue(false);

		await expect(sut.canActivate(context)).rejects.toThrow(
			new UnauthorizedError(ErrorMessages.INVALID_TOKEN),
		);
	});

	it('should throw an error if jwtService throws', async () => {
		(jwtService.verifyJwt as jest.Mock).mockRejectedValue(
			new Error('jwt error'),
		);

		await expect(sut.canActivate(context)).rejects.toThrow(
			new UnauthorizedError(ErrorMessages.INVALID_TOKEN),
		);
	});

	it('should set logged tenant and return true if access token is valid', async () => {
		const result = await sut.canActivate(context);

		expect(result).toBeTruthy();
		expect(envConfigService.getJwtSecret).toHaveBeenCalledTimes(1);

		expect(jwtService.verifyJwt).toHaveBeenCalledTimes(1);
		expect(jwtService.verifyJwt).toHaveBeenCalledWith('validToken', {
			secret: 'mockJwtSecret',
		});

		expect(jwtService.decodeJwt).toHaveBeenCalledTimes(1);
		expect(jwtService.decodeJwt).toHaveBeenCalledWith('validToken');

		expect(loggedTenantService.setLoggedTenant).toHaveBeenCalledTimes(1);
		expect(loggedTenantService.setLoggedTenant).toHaveBeenCalledWith({
			id: payload.sub,
			email: payload.email,
		});
	});
});
