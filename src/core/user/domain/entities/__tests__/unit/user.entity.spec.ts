import { UserDataBuilder } from '../../../testing/helpers/user-data-builder';
import { User, UserProps } from '../../user.entity';

describe('UserEntity unit tests', () => {
	let props: UserProps;
	let sut: User;

	beforeEach(() => {
		User['validate'] = jest.fn();
		props = UserDataBuilder();
		sut = new User(props);
		sut.audit.updatedAt = null;
		jest.clearAllMocks();
	});

	it('should register a non-existent user', () => {
		sut = User.register(props);

		expect(User['validate']).toHaveBeenCalledTimes(1);

		expect(sut['props'].id).toBeTruthy();
		expect(sut['props'].active).toBeFalsy();
		expect(sut['props'].name).toBe(props.name);
		expect(sut['props'].email).toBe(props.email);
		expect(sut['props'].password).toBe(props.password);
		expect(sut['props'].emailVerified).toBeNull();
		expect(sut['props'].forgotPasswordEmailVerificationToken).toBeNull();
		expect(sut['props'].phoneNumber).toBeNull();

		expect(sut['props'].audit.createdAt).toBeInstanceOf(Date);
		expect(sut['props'].audit.updatedAt).toBeInstanceOf(Date);
		expect(sut['props'].audit.deletedAt).toBeNull();
	});

	it('should register an existente user', () => {
		sut.register({
			name: 'New Name',
			email: 'test@email.com',
			password: 'newHashedPassword',
		});

		expect(sut['props'].name).toBe('New Name');
		expect(sut['props'].email).toBe('test@email.com');
		expect(sut['props'].password).toBe('newHashedPassword');
	});

	it('should check user email', () => {
		sut.checkEmail();

		expect(User['validate']).toHaveBeenCalledTimes(1);
		expect(sut['props'].emailVerified).toBeInstanceOf(Date);
		expect(sut['props'].active).toBeTruthy();
		expect(sut['props'].audit.updatedAt).toBeInstanceOf(Date);
	});

	it('should change user password', () => {
		sut.changePassword('other password');
		expect(User['validate']).toHaveBeenCalledTimes(1);
		expect(sut['props'].password).toBe('other password');
		expect(sut['props'].audit.updatedAt).toBeInstanceOf(Date);
	});

	it('should update user profile', () => {
		sut.updateProfile({ name: 'other name', phoneNumber: '5542988887777' });
		expect(User['validate']).toHaveBeenCalledTimes(1);
		expect(sut['props'].name).toBe('other name');
		expect(sut['props'].phoneNumber).toBe('5542988887777');
		expect(sut['props'].audit.updatedAt).toBeInstanceOf(Date);
	});

	it('should delete user account', () => {
		sut = new User({
			...props,
			audit: { updatedAt: 'false updatedAt' as any },
		});
		sut.deleteAccount();
		expect(User['validate']).toHaveBeenCalledTimes(1);
		expect(sut['props'].audit.deletedAt).toBeInstanceOf(Date);
		expect(sut['props'].audit.updatedAt).toBeInstanceOf(Date);
	});

	it('should create email forgot password email verification token', () => {
		sut.createEmailForgotPasswordEmailVerificationToken('token_test');
		expect(sut['forgotPasswordEmailVerificationToken']).toBe('token_test');
	});

	it('should set emailVerified field', () => {
		sut = new User({ ...props, emailVerified: null });
		sut['emailVerified'] = new Date();
		expect(sut['props'].emailVerified).toBeInstanceOf(Date);
	});

	it('should set active field', () => {
		sut = new User({ ...props, active: false });
		sut['active'] = true;
		expect(sut['props'].active).toBeTruthy();
		expect(typeof sut['props'].active).toBe('boolean');
	});

	it('should set name field', () => {
		sut['name'] = 'setter name test';
		expect(sut['props'].name).toBe('setter name test');
		expect(typeof sut['props'].name).toBe('string');
	});

	it('should set phoneNumber field', () => {
		sut['phoneNumber'] = '5542988887777';
		expect(sut['props'].phoneNumber).toBe('5542988887777');
		expect(typeof sut['props'].phoneNumber).toBe('string');
	});

	it('should set password field', () => {
		sut['password'] = 'setter password test';
		expect(sut['props'].password).toBe('setter password test');
		expect(typeof sut['props'].password).toBe('string');
	});

	it('should set email field', () => {
		sut['email'] = 'setter email test';
		expect(sut['props'].email).toBe('setter email test');
		expect(typeof sut['props'].email).toBe('string');
	});

	it('should set forgotPasswordEmailVerificationToken field', () => {
		sut['forgotPasswordEmailVerificationToken'] =
			'setter forgotPasswordEmailVerificationToken test';
		expect(sut['props'].forgotPasswordEmailVerificationToken).toBe(
			'setter forgotPasswordEmailVerificationToken test',
		);
		expect(typeof sut['props'].forgotPasswordEmailVerificationToken).toBe(
			'string',
		);
	});

	it('should get email field', () => {
		expect(sut.email).toBeDefined();
		expect(sut.email).toEqual(props.email);
		expect(typeof sut.email).toBe('string');
	});

	it('should get emailVerified field', () => {
		expect(sut.emailVerified).toBeDefined();
		expect(sut.emailVerified).toEqual(props.emailVerified);
		expect(sut.emailVerified).toBeInstanceOf(Date);
	});

	it('should get active field', () => {
		expect(sut.active).toEqual(props.active);
	});

	it('should get name field', () => {
		expect(sut.name).toBeDefined();
		expect(sut.name).toEqual(props.name);
		expect(typeof sut.name).toBe('string');
	});

	it('should get phoneNumber field', () => {
		expect(sut.phoneNumber).toBeDefined();
		expect(sut.phoneNumber).toEqual(props.phoneNumber);
		expect(typeof sut.phoneNumber).toBe('string');
	});

	it('should get password field', () => {
		expect(sut.password).toBeDefined();
		expect(sut.password).toEqual(props.password);
		expect(typeof sut.password).toBe('string');
	});

	it('should get forgotPasswordEmailVerificationToken field', () => {
		expect(sut.forgotPasswordEmailVerificationToken).toEqual(
			props.forgotPasswordEmailVerificationToken,
		);
	});
});
