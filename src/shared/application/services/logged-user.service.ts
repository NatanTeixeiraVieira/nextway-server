export type LoggedUser = {
	id: string;
	email: string;
};
export interface LoggedUserService {
	getLoggedUser(): LoggedUser | null;
	setLoggedUser(loggedUser: LoggedUser): void;
}
