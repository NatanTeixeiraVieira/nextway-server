import { UserDataBuilder } from '../../../testing/helpers/user-data-builder';
import { User, UserProps } from '../../user.entity';

describe('UserEntity unit tests', () => {
	let props: UserProps;
	let sut: User;

	beforeEach(() => {
		User['validate'] = jest.fn();
		props = UserDataBuilder();
		sut = new User(props);
		jest.clearAllMocks();
	});

	it('should register user', () => {
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
		expect(sut['props'].password).toEqual('other password');
	});

	it('Should test Setter of emailVerified field', () => {
		sut = new User({ ...props, emailVerified: null });
		sut['emailVerified'] = new Date();
		expect(sut['props'].emailVerified).toBeInstanceOf(Date);
	});

	it('Should test Setter of active field', () => {
		sut = new User({ ...props, active: false });
		sut['active'] = true;
		expect(sut['props'].active).toBeTruthy();
		expect(typeof sut['props'].active).toBe('boolean');
	});

	it('Should test Setter of password field', () => {
		sut['password'] = 'setter password test';
		expect(sut['props'].password).toEqual('setter password test');
		expect(typeof sut['props'].password).toBe('string');
	});
});
