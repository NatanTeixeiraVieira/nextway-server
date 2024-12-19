import { EntityValidationError } from '@/shared/domain/errors/validation-error';
import { UserDataBuilder } from '../../../testing/helpers/user-data-builder';
import { RegisterProps, User } from '../../user.entity';

describe('UserEntity integration tests', () => {
	describe('Register method', () => {
		it('Should throw an error when register with invalid name', () => {
			let props: RegisterProps = {
				...UserDataBuilder(),
				name: null,
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
				email: null,
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
				password: null,
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
	});
});
