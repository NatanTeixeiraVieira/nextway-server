import { EnvConfig } from '@/shared/application/env-config/env-config';
import { ErrorMessages } from '@/shared/application/error-messages/error-messages';
import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { JwtService } from '@/shared/application/services/jwt.service';
import { VerifyRecoverPasswordTokenUseCase } from '../../verify-recover-password-token.usecase';

describe('VerifyRecoverPasswordTokenUseCase unit tests', () => {
	let sut: VerifyRecoverPasswordTokenUseCase;
	let envConfigService: EnvConfig;
	let jwtService: JwtService;

	beforeEach(() => {
		jest.clearAllMocks();

		jwtService = {
			verifyJwt: jest.fn().mockResolvedValue(true),
		} as unknown as JwtService;

		envConfigService = {
			getRecoverUserPasswordTokenSecret: jest
				.fn()
				.mockReturnValue('getRecoverUserPasswordTokenSecret'),
		} as unknown as EnvConfig;

		sut = new VerifyRecoverPasswordTokenUseCase(jwtService, envConfigService);
	});

	it('should throw an error if token is not informed', async () => {
		await expect(sut.execute({ token: '' })).rejects.toThrow(
			new BadRequestError(ErrorMessages.INVALID_TOKEN),
		);
	});

	it('should return false when token is invalid', async () => {
		(jwtService.verifyJwt as jest.Mock).mockResolvedValue(false);

		const output = await sut.execute({ token: 'invalid_token' });

		expect(output).toEqual({ isValid: false });
	});

	it('should verify recover password token', async () => {
		const output = await sut.execute({ token: 'test_token' });

		expect(
			envConfigService.getRecoverUserPasswordTokenSecret,
		).toHaveBeenCalledTimes(1);

		expect(jwtService.verifyJwt).toHaveBeenCalledTimes(1);
		expect(jwtService.verifyJwt).toHaveBeenCalledWith('test_token', {
			secret: 'getRecoverUserPasswordTokenSecret',
		});

		expect(output).toEqual({ isValid: true });
	});
});
