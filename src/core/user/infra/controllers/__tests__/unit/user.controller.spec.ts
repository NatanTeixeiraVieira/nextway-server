import { CheckEmailUseCase } from '@/core/user/application/usecases/check-email.usecase';
import {
	Input as LoginInput,
	LoginUseCase,
} from '@/core/user/application/usecases/login.usecase';
import { LogoutUseCase } from '@/core/user/application/usecases/logout.usecase';
import { ChangePasswordUseCase } from '@/core/user/application/usecases/recover-password/change-password.usecase';
import { SendPasswordRecoveryEmailUseCase } from '@/core/user/application/usecases/recover-password/send-password-recovery-email.usecase';
import { VerifyRecoverPasswordTokenUseCase } from '@/core/user/application/usecases/recover-password/verify-recover-password-token.usecase';
import { RefreshTokenUseCase } from '@/core/user/application/usecases/refresh-token.usecase';
import {
	Output,
	Input as RegisterInput,
	RegisterUseCase,
} from '@/core/user/application/usecases/register.usecase';
import { UserDataBuilder } from '@/core/user/domain/testing/helpers/user-data-builder';
import { FastifyReply } from 'fastify/types/reply';
import { CheckEmailPresenter } from '../../../presenters/check-email.presenter';
import { LoginPresenter } from '../../../presenters/login.presenter';
import { RecoverPasswordSendEmailPresenter } from '../../../presenters/recover-password-send-email.presenter';
import { RegisterPresenter } from '../../../presenters/register.presenter';
import { VerifyRecoverPasswordTokenPresenter } from '../../../presenters/verify-recover-password-token.presenter';
import { UserController } from '../../user.controller';

describe('UserController unit tests', () => {
	let sut: UserController;
	let output: Output;
	let mockRegisterUseCase: RegisterUseCase;
	let mockCheckEmailUseCase: CheckEmailUseCase;
	let mockLoginUseCase: LoginUseCase;
	let mockLogoutUseCase: LogoutUseCase;
	let mockRefreshTokenUseCase: RefreshTokenUseCase;
	let sendPasswordRecoveryEmailUseCase: SendPasswordRecoveryEmailUseCase;
	let verifyRecoverPasswordTokenUseCase: VerifyRecoverPasswordTokenUseCase;
	let changePasswordUseCase: ChangePasswordUseCase;

	beforeEach(() => {
		const createdAt = new Date();
		const updatedAt = new Date();
		output = {
			...UserDataBuilder(),
			id: '41874b8a-fecb-42f3-be8d-34912c78b6e2',
			audit: {
				createdAt,
				updatedAt,
				deletedAt: null,
			},
		};
		mockRegisterUseCase = {
			execute: jest.fn().mockResolvedValue(output),
		} as unknown as RegisterUseCase;

		mockCheckEmailUseCase = {
			execute: jest.fn().mockResolvedValue(output),
		} as unknown as CheckEmailUseCase;

		mockLoginUseCase = {
			execute: jest.fn().mockResolvedValue(output),
		} as unknown as LoginUseCase;

		mockLogoutUseCase = {
			execute: jest.fn(),
		} as unknown as LogoutUseCase;

		mockRefreshTokenUseCase = {
			execute: jest.fn(),
		} as unknown as RefreshTokenUseCase;

		sendPasswordRecoveryEmailUseCase = {
			execute: jest.fn().mockResolvedValue(output),
		} as unknown as SendPasswordRecoveryEmailUseCase;

		sendPasswordRecoveryEmailUseCase = {
			execute: jest.fn().mockResolvedValue(output),
		} as unknown as SendPasswordRecoveryEmailUseCase;

		verifyRecoverPasswordTokenUseCase = {
			execute: jest.fn().mockResolvedValue({ isValid: true }),
		} as unknown as VerifyRecoverPasswordTokenUseCase;

		changePasswordUseCase = {
			execute: jest.fn(),
		} as unknown as ChangePasswordUseCase;

		sut = new UserController(
			mockRegisterUseCase,
			mockCheckEmailUseCase,
			mockLoginUseCase,
			mockLogoutUseCase,
			mockRefreshTokenUseCase,
			sendPasswordRecoveryEmailUseCase,
			verifyRecoverPasswordTokenUseCase,
			changePasswordUseCase,
		);
	});

	it('should be defined', () => {
		expect(sut).toBeDefined();
	});

	describe('registerUser method', () => {
		it('should create a user', async () => {
			const input: RegisterInput = {
				name: 'test',
				email: 'test@email.com',
				password: '12345678',
			};

			const presenter = await sut.registerUser(input);

			expect(presenter).toBeInstanceOf(RegisterPresenter);
			expect(presenter).toStrictEqual(new RegisterPresenter(output));
			expect(mockRegisterUseCase.execute).toHaveBeenCalledTimes(1);
			expect(mockRegisterUseCase.execute).toHaveBeenCalledWith(input);
		});
	});

	describe('checkUserEmail method', () => {
		it('should check a user email', async () => {
			const setCookie = jest.fn();
			const replyMock = { setCookie } as unknown as FastifyReply;
			const presenter = await sut.checkUserEmail(replyMock, 'token');
			expect(presenter).toBeInstanceOf(CheckEmailPresenter);
			expect(presenter).toStrictEqual(new CheckEmailPresenter(output));
			expect(mockCheckEmailUseCase.execute).toHaveBeenCalledTimes(1);
			expect(mockCheckEmailUseCase.execute).toHaveBeenCalledWith({
				checkEmailToken: 'token',
				setCookies: expect.any(Function),
			});
		});
	});

	describe('userLogin method', () => {
		it('should do user login', async () => {
			const setCookie = jest.fn();
			const input: LoginInput = {
				email: 'test@email.com',
				password: '12345678',
				setCookies: setCookie,
			};

			const replyMock = { setCookie } as unknown as FastifyReply;
			const presenter = await sut.userLogin(replyMock, input);
			expect(presenter).toBeInstanceOf(LoginPresenter);
			expect(presenter).toStrictEqual(new LoginPresenter(output));
			expect(mockLoginUseCase.execute).toHaveBeenCalledTimes(1);
			expect(mockLoginUseCase.execute).toHaveBeenCalledWith({
				email: 'test@email.com',
				password: '12345678',
				setCookies: expect.any(Function),
			});
		});
	});

	describe('userLogout method', () => {
		it('should do user logout', async () => {
			const clearCookie = jest.fn();

			const replyMock = { clearCookie } as unknown as FastifyReply;
			const presenter = sut.userLogout(replyMock);
			expect(presenter).toBeUndefined();
			expect(mockLogoutUseCase.execute).toHaveBeenCalledTimes(1);
			expect(mockLogoutUseCase.execute).toHaveBeenCalledWith({
				clearCookies: expect.any(Function),
			});
		});
	});

	describe('refreshUserToken method', () => {
		it('should refresh user token', async () => {
			const setCookie = jest.fn();
			const replyMock = { setCookie } as unknown as FastifyReply;
			await sut.refreshUserToken(replyMock);
			expect(mockRefreshTokenUseCase.execute).toHaveBeenCalledTimes(1);
			expect(mockRefreshTokenUseCase.execute).toHaveBeenCalledWith({
				setCookies: expect.any(Function),
			});
		});
	});

	describe('recoverUserPasswordSendEmail method', () => {
		it('should recover user password and send verification email', async () => {
			const presenter = await sut.recoverUserPasswordSendEmail({
				email: 'test@email.com',
			});

			expect(presenter).toBeInstanceOf(RecoverPasswordSendEmailPresenter);
			expect(presenter).toStrictEqual(
				new RecoverPasswordSendEmailPresenter(output),
			);
			expect(sendPasswordRecoveryEmailUseCase.execute).toHaveBeenCalledTimes(1);
			expect(sendPasswordRecoveryEmailUseCase.execute).toHaveBeenCalledWith({
				email: 'test@email.com',
			});
		});
	});

	describe('recoverUserPasswordVerifyToken method', () => {
		it('should verify recover password token', async () => {
			const presenter = await sut.recoverUserPasswordVerifyToken({
				token: 'test_token',
			});

			expect(presenter).toBeInstanceOf(VerifyRecoverPasswordTokenPresenter);
			expect(presenter).toStrictEqual(
				new VerifyRecoverPasswordTokenPresenter({ isValid: true }),
			);
			expect(verifyRecoverPasswordTokenUseCase.execute).toHaveBeenCalledTimes(
				1,
			);
			expect(verifyRecoverPasswordTokenUseCase.execute).toHaveBeenCalledWith({
				token: 'test_token',
			});
		});
	});

	describe('changeUserPassword method', () => {
		it('should change user password', async () => {
			await sut.changeUserPassword({
				changePasswordToken: 'changePasswordToken_test',
				password: '12345678',
			});

			expect(changePasswordUseCase.execute).toHaveBeenCalledTimes(1);
			expect(changePasswordUseCase.execute).toHaveBeenCalledWith({
				changePasswordToken: 'changePasswordToken_test',
				password: '12345678',
			});
		});
	});
});
