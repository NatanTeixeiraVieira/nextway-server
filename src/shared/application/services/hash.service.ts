export interface HashService {
	generate(password: string): Promise<string>;
	compare(password: string, hashedPassword: string): Promise<boolean>;
}
