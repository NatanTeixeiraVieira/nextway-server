import { Providers } from '@/shared/application/constants/providers';
import { EnvConfig } from '@/shared/application/env-config/env-config';
import { Module } from '@nestjs/common';
import { HashBcryptService } from './bcrypt/hash-bcrypt.service';

@Module({
	providers: [
		{
			provide: Providers.HASH_SERVICE,
			useFactory: (envConfig: EnvConfig) => {
				return new HashBcryptService(envConfig);
			},
			inject: [Providers.ENV_CONFIG_SERVICE],
		},
	],
	exports: [Providers.HASH_SERVICE],
})
export class HashServiceModule {}
