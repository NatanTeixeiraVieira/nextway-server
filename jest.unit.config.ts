import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

export default {
	moduleFileExtensions: ['js', 'json', 'ts'],
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
		prefix: '<rootDir>/',
	}),
	testRegex: '.*\\.spec\\.ts$',
	transform: {
		'^.+\\.ts$': 'ts-jest',
		// If you want to use js, you need to change the regex to include ts files
		// '^.+\\.(t|j)s$': 'ts-jest',
	},
	collectCoverageFrom: ['**/*.ts'],
	// If you want to use js, you need to change the regex to include ts files
	// collectCoverageFrom: ['**/*.(t|j)s'],
	coverageDirectory: '../coverage',
	testEnvironment: 'node',
};
