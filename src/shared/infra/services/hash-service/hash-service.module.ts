import { EnvConfig } from '@/shared/application/env-config/env-config';
import { Module } from '@nestjs/common';
import { EnvConfigService } from '../../env-config/env-config.service';
import { HashBcryptService } from './bcrypt/hash-bcrypt.service';

@Module({
	providers: [
		{
			provide: HashBcryptService,
			useFactory: (envConfig: EnvConfig) => {
				return new HashBcryptService(envConfig);
			},
			inject: [EnvConfigService],
		},
	],
	exports: [HashBcryptService],
})
export class HashServiceModule {}
