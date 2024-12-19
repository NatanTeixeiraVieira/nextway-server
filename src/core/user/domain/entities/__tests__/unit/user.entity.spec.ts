import { UserDataBuilder } from '../../../testing/helpers/user-data-builder';
import { User, UserProps } from '../../user.entity';

describe('UserEntity unit tests', () => {
	let props: UserProps;

	beforeEach(() => {
		User['validate'] = jest.fn();
		props = UserDataBuilder();
	});

	it('should register user', () => {
		console.log('🚀 ~ it ~ props:', props);
		const user = User.register(props);

		expect(User['validate']).toHaveBeenCalledTimes(1);

		expect(user['props'].id).toBeTruthy();
		expect(user['props'].active).toBeFalsy();
		expect(user['props'].name).toBe(props.name);
		expect(user['props'].email).toBe(props.email);
		expect(user['props'].password).toBe(props.password);
		expect(user['props'].emailVerified).toBeNull();
		expect(user['props'].forgotPasswordEmailVerificationToken).toBeNull();
		expect(user['props'].phoneNumber).toBeNull();

		expect(user['props'].audit.createdAt).toBeInstanceOf(Date);
		expect(user['props'].audit.updatedAt).toBeInstanceOf(Date);
		expect(user['props'].audit.deletedAt).toBeNull();
	});
});
