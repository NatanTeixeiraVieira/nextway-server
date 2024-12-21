export interface UserQuery {
	emailExists(email: string): Promise<boolean>;
}
