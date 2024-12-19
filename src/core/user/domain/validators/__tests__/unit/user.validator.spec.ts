import { UserProps } from '../../../entities/user.entity';
import { UserDataBuilder } from '../../../testing/helpers/user-data-builder';
import {
	UserRules,
	UserValidator,
	UserValidatorFactory,
} from '../../user.validator';

let sut: UserValidator;
let props: UserProps;

describe('UserValidator unit tests', () => {
	beforeEach(() => {
		const userValidatorFactory = new UserValidatorFactory();
		sut = userValidatorFactory.create();
		props = UserDataBuilder({});
	});

	it('should test invalidation cases for name field', () => {
		let isValid = sut.validate(null as any);
		expect(isValid).toBeFalsy();
		expect(sut.errors['name']).toStrictEqual([
			'name should not be empty',
			'name must be a string',
			'name must be shorter than or equal to 255 characters',
		]);

		isValid = sut.validate({ ...props, name: '' });
		expect(isValid).toBeFalsy();
		expect(sut.errors['name']).toStrictEqual(['name should not be empty']);

		isValid = sut.validate({ ...props, name: 10 as any });
		expect(isValid).toBeFalsy();
		expect(sut.errors['name']).toStrictEqual([
			'name must be a string',
			'name must be shorter than or equal to 255 characters',
		]);

		isValid = sut.validate({ ...props, name: 'a'.repeat(256) });
		expect(isValid).toBeFalsy();
		expect(sut.errors['name']).toStrictEqual([
			'name must be shorter than or equal to 255 characters',
		]);
	});

	it('should test invalidation cases for email field', () => {
		let isValid = sut.validate(null as any);
		expect(isValid).toBeFalsy();
		expect(sut.errors['email']).toStrictEqual([
			'email should not be empty',
			'email must be an email',
			'email must be a string',
			'email must be shorter than or equal to 255 characters',
		]);

		isValid = sut.validate({ ...props, email: '' });
		expect(isValid).toBeFalsy();
		expect(sut.errors['email']).toStrictEqual([
			'email should not be empty',
			'email must be an email',
		]);

		isValid = sut.validate({ ...props, email: 10 as any });
		expect(isValid).toBeFalsy();
		expect(sut.errors['email']).toStrictEqual([
			'email must be an email',
			'email must be a string',
			'email must be shorter than or equal to 255 characters',
		]);

		isValid = sut.validate({ ...props, email: 'a'.repeat(256) });
		expect(isValid).toBeFalsy();
		expect(sut.errors['email']).toStrictEqual([
			'email must be an email',
			'email must be shorter than or equal to 255 characters',
		]);
	});

	it('should test invalidation cases for password field', () => {
		let isValid = sut.validate(null as any);
		expect(isValid).toBeFalsy();
		expect(sut.errors['password']).toStrictEqual([
			'password should not be empty',
			'password must be a string',
			'password must be shorter than or equal to 100 characters',
		]);

		isValid = sut.validate({ ...props, password: '' });
		expect(isValid).toBeFalsy();
		expect(sut.errors['password']).toStrictEqual([
			'password should not be empty',
		]);

		isValid = sut.validate({ ...props, password: 10 as any });
		expect(isValid).toBeFalsy();
		expect(sut.errors['password']).toStrictEqual([
			'password must be a string',
			'password must be shorter than or equal to 100 characters',
		]);

		isValid = sut.validate({ ...props, password: 'a'.repeat(101) });
		expect(isValid).toBeFalsy();
		expect(sut.errors['password']).toStrictEqual([
			'password must be shorter than or equal to 100 characters',
		]);
	});

	it('should test invalidation cases for phoneNumber field', () => {
		let isValid = sut.validate(null);
		expect(isValid).toBeFalsy();
		expect(sut.errors['phoneNumber']).toBeUndefined();

		isValid = sut.validate({ ...props, phoneNumber: '' });
		expect(isValid).toBeFalsy();
		expect(sut.errors['phoneNumber']).toStrictEqual([
			'phoneNumber must match /^\\d+$/ regular expression',
			'phoneNumber must be longer than or equal to 13 characters',
		]);

		isValid = sut.validate({ ...props, phoneNumber: 10 as any });
		expect(isValid).toBeFalsy();
		expect(sut.errors['phoneNumber']).toStrictEqual([
			'phoneNumber must match /^\\d+$/ regular expression',
			'phoneNumber must be longer than or equal to 13 and shorter than or equal to 13 characters',
			'phoneNumber must be a string',
		]);

		isValid = sut.validate({ ...props, phoneNumber: 'a' });
		expect(isValid).toBeFalsy();
		expect(sut.errors['phoneNumber']).toStrictEqual([
			'phoneNumber must match /^\\d+$/ regular expression',
			'phoneNumber must be longer than or equal to 13 characters',
		]);

		isValid = sut.validate({ ...props, phoneNumber: '10' });
		expect(isValid).toBeFalsy();
		expect(sut.errors['phoneNumber']).toStrictEqual([
			'phoneNumber must be longer than or equal to 13 characters',
		]);

		isValid = sut.validate({ ...props, phoneNumber: '55429888877776' });
		expect(isValid).toBeFalsy();
		expect(sut.errors['phoneNumber']).toStrictEqual([
			'phoneNumber must be shorter than or equal to 13 characters',
		]);
	});

	it('should test invalidation cases for emailVerified field', () => {
		let isValid = sut.validate(null);
		expect(isValid).toBeFalsy();
		expect(sut.errors['emailVerified']).toBeUndefined();

		isValid = sut.validate({ ...props, emailVerified: 10 as any });
		expect(isValid).toBeFalsy();
		expect(sut.errors['emailVerified']).toStrictEqual([
			'emailVerified must be a Date instance',
		]);

		isValid = sut.validate({ ...props, emailVerified: '2024' as any });
		expect(isValid).toBeFalsy();
		expect(sut.errors['emailVerified']).toStrictEqual([
			'emailVerified must be a Date instance',
		]);
	});

	it('should test valid cases for user rules', () => {
		const isValid = sut.validate(props);
		expect(isValid).toBeTruthy();
		expect(sut.validatedData).toStrictEqual(new UserRules(props));
	});
});
