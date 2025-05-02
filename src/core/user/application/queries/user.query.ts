export interface UserQuery {
	emailAccountActiveExists(email: string): Promise<boolean>;
	existsActiveById(id: string): Promise<boolean>;
}
