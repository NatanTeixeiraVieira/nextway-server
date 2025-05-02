import { User } from '@/core/user/domain/entities/user.entity';

// TODO Replace User with id only
export interface LoggedUserService {
	getLoggedUser(): User | null;
	setLoggedUser(loggedUser: User): void;
}
