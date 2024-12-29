import { DynamicModule, Global, Module } from '@nestjs/common';
import {
	ConfigModule,
	ConfigModuleOptions,
	ConfigService,
} from '@nestjs/config';
import { join } from 'node:path';
import { EnvConfigService } from './env-config.service';

@Global()
@Module({
	imports: [ConfigModule, EnvConfigModule],
	providers: [
		{
			provide: EnvConfigService,
			useFactory: (configService: ConfigService) => {
				return new EnvConfigService(configService);
			},
			inject: [ConfigService],
		},
	],
	exports: [EnvConfigService],
})
export class EnvConfigModule extends ConfigModule {
	static forRoot(options: ConfigModuleOptions = {}): Promise<DynamicModule> {
		return ConfigModule.forRoot({
			isGlobal: true,
			...options,
			envFilePath: [
				join(__dirname, `../../../../.env.${process.env.NODE_ENV}`),
			],
		});
	}
}
