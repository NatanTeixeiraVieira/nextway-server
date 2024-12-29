export type NodeEnv = 'production' | 'development' | 'test';

export interface EnvConfig {
	getPort(): number;
	getDbHost(): string;
	getDbPort(): number;
	getDbName(): string;
	getDbUsername(): string;
	getDbPassword(): string;
	getDbSchema(): string;
	getDbLogs(): boolean;
	getNodeEnv(): NodeEnv;
	getMigrationRun(): boolean;
	getBaseUrl(): string;
	getJwtActiveAccountSecret(): string;
	getJwtActiveAccountExpiresIn(): number;
	getEncryptionSalts(): number;
	getApplicationMailUser(): string;
	getApplicationMailPassword(): string;
	getOrigin(): string;
	getAllowedMethods(): string;
}
