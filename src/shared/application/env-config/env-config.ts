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
}
