import { User } from '@/core/user/domain/entities/user.entity';
import { LoggedUserService } from '@/shared/application/services/logged-user.service';
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class LoggedUserNestjsService implements LoggedUserService {
	private loggedUser: User;

	getLoggedUser(): User {
		return this.loggedUser;
	}

	setLoggedUser(loggedUser: User) {
		this.loggedUser = loggedUser;
	}
}
