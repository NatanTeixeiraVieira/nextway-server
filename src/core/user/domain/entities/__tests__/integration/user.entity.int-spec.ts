import { EntityValidationError } from '@/shared/domain/errors/validation-error';
import { UserDataBuilder } from '../../../testing/helpers/user-data-builder';
import { RegisterProps, User, UserProps } from '../../user.entity';

describe('UserEntity integration tests', () => {
	let sut: User;

	beforeEach(() => {
		sut = new User(UserDataBuilder());
	});

	describe('static Register method', () => {
		it('Should throw an error when register with invalid name', () => {
			let props: RegisterProps = {
				...UserDataBuilder(),
				name: null as any,
			};
			expect(() => User.register(props)).toThrow(EntityValidationError);

			props = {
				...UserDataBuilder(),
				name: '',
			};
			expect(() => User.register(props)).toThrow(EntityValidationError);

			props = {
				...UserDataBuilder(),
				name: 10 as any,
			};
			expect(() => User.register(props)).toThrow(EntityValidationError);

			props = {
				...UserDataBuilder(),
				name: 'a'.repeat(256),
			};
			expect(() => User.register(props)).toThrow(EntityValidationError);
		});

		it('Should throw an error when register with invalid email', () => {
			let props: RegisterProps = {
				...UserDataBuilder(),
				email: null as any,
			};
			expect(() => User.register(props)).toThrow(EntityValidationError);

			props = {
				...UserDataBuilder(),
				email: '',
			};
			expect(() => User.register(props)).toThrow(EntityValidationError);

			props = {
				...UserDataBuilder(),
				email: 10 as any,
			};
			expect(() => User.register(props)).toThrow(EntityValidationError);

			props = {
				...UserDataBuilder(),
				email: 'a'.repeat(256),
			};
			expect(() => User.register(props)).toThrow(EntityValidationError);

			props = {
				...UserDataBuilder(),
				email: 'email@email.c',
			};
			expect(() => User.register(props)).toThrow(EntityValidationError);
		});

		it('Should throw an error when register with invalid password', () => {
			let props: RegisterProps = {
				...UserDataBuilder(),
				password: null as any,
			};
			expect(() => User.register(props)).toThrow(EntityValidationError);

			props = {
				...UserDataBuilder(),
				password: '',
			};
			expect(() => User.register(props)).toThrow(EntityValidationError);

			props = {
				...UserDataBuilder(),
				password: 10 as any,
			};
			expect(() => User.register(props)).toThrow(EntityValidationError);

			props = {
				...UserDataBuilder(),
				password: 'a'.repeat(101),
			};
			expect(() => User.register(props)).toThrow(EntityValidationError);
		});

		it('Should register user', () => {
			expect.assertions(0);

			const props: UserProps = {
				...UserDataBuilder(),
			};
			User.register(props);
		});
	});

	describe('Register method', () => {
		it('Should throw an error when register with invalid name', () => {
			let props: RegisterProps = {
				...UserDataBuilder(),
				name: null as any,
			};
			expect(() => sut.register(props)).toThrow(EntityValidationError);

			props = {
				...UserDataBuilder(),
				name: '',
			};
			expect(() => sut.register(props)).toThrow(EntityValidationError);

			props = {
				...UserDataBuilder(),
				name: 10 as any,
			};
			expect(() => sut.register(props)).toThrow(EntityValidationError);

			props = {
				...UserDataBuilder(),
				name: 'a'.repeat(256),
			};
			expect(() => sut.register(props)).toThrow(EntityValidationError);
		});

		it('Should throw an error when register with invalid email', () => {
			let props: RegisterProps = {
				...UserDataBuilder(),
				email: null as any,
			};
			expect(() => sut.register(props)).toThrow(EntityValidationError);

			props = {
				...UserDataBuilder(),
				email: '',
			};
			expect(() => sut.register(props)).toThrow(EntityValidationError);

			props = {
				...UserDataBuilder(),
				email: 10 as any,
			};
			expect(() => sut.register(props)).toThrow(EntityValidationError);

			props = {
				...UserDataBuilder(),
				email: 'a'.repeat(256),
			};
			expect(() => sut.register(props)).toThrow(EntityValidationError);

			props = {
				...UserDataBuilder(),
				email: 'email@email.c',
			};
			expect(() => sut.register(props)).toThrow(EntityValidationError);
		});

		it('Should throw an error when register with invalid password', () => {
			let props: RegisterProps = {
				...UserDataBuilder(),
				password: null as any,
			};
			expect(() => sut.register(props)).toThrow(EntityValidationError);

			props = {
				...UserDataBuilder(),
				password: '',
			};
			expect(() => sut.register(props)).toThrow(EntityValidationError);

			props = {
				...UserDataBuilder(),
				password: 10 as any,
			};
			expect(() => sut.register(props)).toThrow(EntityValidationError);

			props = {
				...UserDataBuilder(),
				password: 'a'.repeat(101),
			};
			expect(() => sut.register(props)).toThrow(EntityValidationError);
		});

		it('Should register user', () => {
			expect.assertions(0);

			const props: UserProps = {
				...UserDataBuilder(),
			};
			sut.register(props);
		});
	});

	describe('CheckEmail method', () => {
		it('Should check email', () => {
			expect.assertions(0);
			const user = new User(UserDataBuilder());

			user.checkEmail();
		});
	});

	describe('ChangePassword method', () => {
		it('Should throw an error when register with invalid password ', () => {
			expect(() => sut.changePassword(null as any)).toThrow(
				EntityValidationError,
			);
			expect(() => sut.changePassword('')).toThrow(EntityValidationError);
			expect(() => sut.changePassword(10 as any)).toThrow(
				EntityValidationError,
			);
			expect(() => sut.changePassword('a'.repeat(101))).toThrow(
				EntityValidationError,
			);
		});

		it('Should change user password', () => {
			expect.assertions(0);
			const user = new User(UserDataBuilder());

			user.changePassword('new password');
		});
	});

	describe('UpdateProfile method', () => {
		it('Should throw an error when update profile with invalid name', () => {
			expect(() =>
				sut.updateProfile({ name: null as any, phoneNumber: '5542988887777' }),
			).toThrow(EntityValidationError);
			expect(() =>
				sut.updateProfile({ name: '', phoneNumber: '5542988887777' }),
			).toThrow(EntityValidationError);
			expect(() =>
				sut.updateProfile({ name: 10 as any, phoneNumber: '5542988887777' }),
			).toThrow(EntityValidationError);
			expect(() =>
				sut.updateProfile({
					name: 'a'.repeat(256),
					phoneNumber: '5542988887777',
				}),
			).toThrow(EntityValidationError);
		});

		it('Should throw an error when update profile with invalid phoneNumber', () => {
			expect(() =>
				sut.updateProfile({ name: 'other name', phoneNumber: '' }),
			).toThrow(EntityValidationError);
			expect(() =>
				sut.updateProfile({ name: 'other name', phoneNumber: 10 as any }),
			).toThrow(EntityValidationError);
			expect(() =>
				sut.updateProfile({
					name: 'other name',
					phoneNumber: '55429888877771',
				}),
			).toThrow(EntityValidationError);
		});

		it('Should update user profile', () => {
			expect.assertions(0);
			const user = new User(UserDataBuilder());

			user.updateProfile({ name: 'new name', phoneNumber: '5542988887777' });
		});
	});

	describe('deleteAccount method', () => {
		it('Should delete user account', () => {
			expect.assertions(0);
			const user = new User(UserDataBuilder());
			user.deleteAccount();
		});
	});

	describe('createEmailForgotPasswordEmailVerificationToken method', () => {
		it('Should create email forgot password email verification token', () => {
			const user = new User(
				UserDataBuilder({ forgotPasswordEmailVerificationToken: null }),
			);
			user.createEmailForgotPasswordEmailVerificationToken(
				'dc27f367-d2f2-4dd5-8312-d47fa81193cc',
			);

			expect(user.forgotPasswordEmailVerificationToken).toBe(
				'dc27f367-d2f2-4dd5-8312-d47fa81193cc',
			);
		});
	});
});
