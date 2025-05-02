export type LoggedUser = {
	id: string;
};
export interface LoggedUserService {
	getLoggedUser(): LoggedUser | null;
	setLoggedUser(loggedUser: LoggedUser): void;
}
