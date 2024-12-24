import { EnvConfig } from '@/shared/application/env-config/env-config';
import { HashService } from '@/shared/application/services/hash.service';
import bcrypt from 'bcrypt';

export class HashBcryptService implements HashService {
	constructor(private readonly envConfig: EnvConfig) {}

	async generate(value: string): Promise<string> {
		const encryptionSalts = this.envConfig.getEncryptionSalts();
		const hashedValue = await bcrypt.hash(value, encryptionSalts);
		return hashedValue;
	}

	async compare(value: string, hashedValue: string): Promise<boolean> {
		const isValid = await bcrypt.compare(value, hashedValue);
		return isValid;
	}
}
