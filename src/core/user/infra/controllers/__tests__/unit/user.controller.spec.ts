import { CheckEmailUseCase } from '@/core/user/application/usecases/check-email.usecase';
import {
	Input as LoginInput,
	LoginUseCase,
} from '@/core/user/application/usecases/login.usecase';
import { LogoutUseCase } from '@/core/user/application/usecases/logout.usecase';
import {
	Output,
	Input as RegisterInput,
	RegisterUseCase,
} from '@/core/user/application/usecases/register.usecase';
import { UserDataBuilder } from '@/core/user/domain/testing/helpers/user-data-builder';
import { FastifyReply } from 'fastify/types/reply';
import { CheckEmailPresenter } from '../../../presenters/check-email.presenter';
import { LoginPresenter } from '../../../presenters/login.presenter';
import { RegisterPresenter } from '../../../presenters/register.presenter';
import { UserController } from '../../user.controller';

describe('UserController unit tests', () => {
	let sut: UserController;
	let output: Output;
	let mockRegisterUseCase: RegisterUseCase;
	let mockCheckEmailUseCase: CheckEmailUseCase;
	let mockLoginUseCase: LoginUseCase;
	let mockLogoutUseCase: LogoutUseCase;

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
			execute: jest.fn().mockResolvedValue(output),
		} as unknown as LogoutUseCase;

		sut = new UserController(
			mockRegisterUseCase,
			mockCheckEmailUseCase,
			mockLoginUseCase,
			mockLogoutUseCase,
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
});
