export interface UserQuery {
	emailAccountActiveExists(email: string): Promise<boolean>;
}
