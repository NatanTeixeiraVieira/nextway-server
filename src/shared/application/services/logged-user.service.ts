import { User } from '@/core/user/domain/entities/user.entity';

export interface LoggedUserService {
	getLoggedUser(): User | null;
	setLoggedUser(loggedUser: User): void;
}
