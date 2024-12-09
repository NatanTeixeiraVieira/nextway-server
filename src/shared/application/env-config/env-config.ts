export interface EnvConfig {
	getPort(): number;
	getDbHost(): string;
	getDbPort(): number;
	getDbName(): string;
	getDbUsername(): string;
	getDbPassword(): string;
	getDbSchema(): string;
	getDbLogs(): boolean;
	getNodeEnv(): 'production' | 'development';
	getMigrationRun(): boolean;
}
