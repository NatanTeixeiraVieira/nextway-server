import { Providers } from '@/shared/application/constants/providers';
import { EnvConfig } from '@/shared/application/env-config/env-config';
import { Module } from '@nestjs/common';
import { FileSupabaseService } from './supabase/file-supabase.service';

@Module({
	providers: [
		{
			provide: Providers.FILE_SERVICE,
			useFactory: (envConfigService: EnvConfig) => {
				return new FileSupabaseService(envConfigService);
			},
			inject: [Providers.ENV_CONFIG_SERVICE],
		},
	],
})
export class FileModule {}
