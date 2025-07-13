import { Tenant } from '@/core/tenant/domain/entities/tenant.entity';
import { TenantRepository } from '@/core/tenant/domain/repositories/tenant.repository';
import { ErrorMessages } from '@/shared/application/error-messages/error-messages';
import { InvalidEmailCodeError } from '@/shared/application/errors/invalid-email-code-error';
import { NotFoundError } from '@/shared/application/errors/not-found-error';
import { AuthService } from '@/shared/application/services/auth.service';
import { TenantOutputMapper } from '../../../outputs/tenant-output';
import { CheckTenantEmailUseCase } from '../../check-tenant-email.usecase';

describe('CheckTenantEmailUseCase unit tests', () => {
	let sut: CheckTenantEmailUseCase;
	let tenantRepository: TenantRepository;
	let tenantOutputMapper: TenantOutputMapper;
	let authService: AuthService;
	let tenant: Tenant;

	const validInput = {
		email: 'tenant@example.com',
		verifyEmailCode: 'ABC123',
		setCookies: jest.fn(),
	};

	beforeEach(() => {
		tenant = {
			verifyEmailCode: 'ABC123',
			checkEmail: jest.fn(),
			toJSON: jest
				.fn()
				.mockReturnValue({ id: 'tenant-id', email: 'tenant@example.com' }),
		} as unknown as Tenant;

		tenantRepository = {
			getByEmail: jest.fn().mockResolvedValue(tenant),
			update: jest.fn().mockResolvedValue(undefined),
		} as unknown as TenantRepository;

		tenantOutputMapper = {
			toOutput: jest
				.fn()
				.mockReturnValue({ id: 'tenant-id', email: 'tenant@example.com' }),
		} as unknown as TenantOutputMapper;

		authService = {
			authenticate: jest.fn().mockResolvedValue({
				accessToken: 'accessTokenTest',
				refreshToken: 'refreshTokenTest',
			}),
			setTokensInCookies: jest.fn(),
		} as unknown as AuthService;

		sut = new CheckTenantEmailUseCase(
			tenantRepository,
			tenantOutputMapper,
			authService,
		);
	});

	it('should throw NotFoundError when tenant is not found', async () => {
		(tenantRepository.getByEmail as jest.Mock).mockResolvedValue(null);

		await expect(sut.execute(validInput)).rejects.toThrow(
			new NotFoundError(ErrorMessages.tenantNotFoundByEmail(validInput.email)),
		);
	});

	it('should throw InvalidEmailCodeError when verifyEmailCode does not match', async () => {
		(tenantRepository.getByEmail as jest.Mock).mockResolvedValue({
			...tenant,
			verifyEmailCode: 'WRONGCODE',
		});

		await expect(sut.execute(validInput)).rejects.toThrow(
			new InvalidEmailCodeError(ErrorMessages.INVALID_CHECK_EMAIL_CODE),
		);
	});

	it('should check tenant email, update, authenticate, set cookies, and return output', async () => {
		const output = await sut.execute(validInput);

		expect(tenantRepository.getByEmail).toHaveBeenCalledWith(validInput.email);
		expect(tenant.checkEmail).toHaveBeenCalledTimes(1);
		expect(tenantRepository.update).toHaveBeenCalledWith(tenant);
		expect(authService.authenticate).toHaveBeenCalledWith(tenant);
		expect(authService.setTokensInCookies).toHaveBeenCalledWith(
			expect.objectContaining({
				accessToken: 'accessTokenTest',
				refreshToken: 'refreshTokenTest',
				setCookies: validInput.setCookies,
			}),
		);
		expect(tenantOutputMapper.toOutput).toHaveBeenCalledWith(tenant);
		expect(output).toEqual({ id: 'tenant-id', email: 'tenant@example.com' });
	});
});
