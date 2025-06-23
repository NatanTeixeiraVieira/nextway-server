import { Providers } from '@/shared/application/constants/providers';
import { EnvConfig } from '@/shared/application/env-config/env-config';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailNestjsService } from './nestjs/mail-nestjs.service';

@Module({
	imports: [
		MailerModule.forRootAsync({
			useFactory: (envConfig: EnvConfig) => ({
				transport: {
					host: envConfig.getApplicationMailHost(),
					port: envConfig.getApplicationMailPort(),
					secure: true,
					auth: {
						user: envConfig.getApplicationMailUser(),
						pass: envConfig.getApplicationMailPassword(),
					},
				},
			}),
			inject: [Providers.ENV_CONFIG_SERVICE],
		}),
	],
	providers: [
		{
			provide: Providers.MAIL_SERVICE,
			useFactory: (mailerService: MailerService) => {
				return new MailNestjsService(mailerService);
			},
			inject: [MailerService],
		},
	],
	exports: [Providers.MAIL_SERVICE],
})
export class MailServiceModule {}
