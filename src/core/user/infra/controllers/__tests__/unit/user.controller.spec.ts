import { CheckEmailUseCase } from '@/core/user/application/usecases/check-email.usecase';
import {
	Input,
	Output,
	RegisterUseCase,
} from '@/core/user/application/usecases/register.usecase';
import { UserDataBuilder } from '@/core/user/domain/testing/helpers/user-data-builder';
import { CheckEmailPresenter } from '../../../presenters/check-email.presenter';
import { RegisterPresenter } from '../../../presenters/register.presenter';
import { UserController } from '../../user.controller';

describe('UserController unit tests', () => {
	let sut: UserController;
	let output: Output;
	let mockRegisterUseCase: RegisterUseCase;
	let mockCheckEmailUseCase: CheckEmailUseCase;

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

		sut = new UserController(mockRegisterUseCase, mockCheckEmailUseCase);
	});

	describe('registerUser method', () => {
		it('should be defined', () => {
			expect(sut).toBeDefined();
		});

		it('should create a user', async () => {
			const input: Input = {
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
		it('should be defined', () => {
			expect(sut).toBeDefined();
		});

		it('should check a user email', async () => {
			const setCookie = jest.fn();
			const replyMock = { setCookie };
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
});