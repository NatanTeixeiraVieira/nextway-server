import { User } from '@/core/user/domain/entities/user.entity';
import { LoggedUserNestjsService } from '../../logged-user.service';

describe('LoggedUserNestjsService unit tests', () => {
	let sut: LoggedUserNestjsService;

	beforeEach(() => {
		sut = new LoggedUserNestjsService();
	});

	it('should be defined', () => {
		expect(sut).toBeDefined();
	});

	it('should set  logged user', () => {
		const user = {
			id: '1',
			name: 'Test User',
			email: 'test@example.com',
			password: 'password',
		} as User;

		sut.setLoggedUser(user);

		expect(sut['loggedUser']).toStrictEqual(user);
	});

	it('should get logged user', () => {
		const user = {
			id: '1',
			name: 'Test User',
			email: 'test@example.com',
			password: 'password',
		} as User;

		sut['loggedUser'] = user;

		expect(sut.getLoggedUser()).toStrictEqual(user);
	});

	it('should return undefined if no user is set', () => {
		const loggedUser = sut.getLoggedUser();
		expect(loggedUser).toBeUndefined();
	});
});
