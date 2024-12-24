import { EnvConfigService } from '@/shared/infra/env-config/env-config.service';
import { ConfigService } from '@nestjs/config';
import { HashBcryptService } from '../../hash-bcrypt.service';

describe('HashBcryptService unit tests', () => {
	let sut: HashBcryptService;

	beforeEach(() => {
		const envConfig = new EnvConfigService(new ConfigService());
		sut = new HashBcryptService(envConfig);
	});

	it('should return encrypted password', async () => {
		const password = 'test password';
		const hash = await sut.generate(password);
		expect(hash).toBeTruthy();
	});

	it('should return false on invalid password and hash comparison', async () => {
		const password = 'TestPassword123';
		const hash = await sut.generate(password);
		const result = await sut.compare('test', hash);
		expect(result).toBeFalsy();
	});

	it('Should return true on valid password and hash comparison', async () => {
		const password = 'TestPassword123';
		const hash = await sut.generate(password);
		const result = await sut.compare(password, hash);
		expect(result).toBeTruthy();
	});
});
