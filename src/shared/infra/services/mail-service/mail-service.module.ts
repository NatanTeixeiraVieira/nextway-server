import { EnvConfig } from '@/shared/application/env-config/env-config';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { EnvConfigService } from '../../env-config/env-config.service';
import { MailNestjsService } from './nestjs/mail-nestjs.service';

@Module({
	imports: [
		MailerModule.forRootAsync({
			useFactory: (envConfig: EnvConfig) => ({
				transport: {
					host: 'smtp.gmail.com',
					port: 465,
					secure: true,
					auth: {
						user: envConfig.getApplicationMailUser(),
						pass: envConfig.getApplicationMailPassword(),
					},
				},
			}),
			inject: [EnvConfigService],
		}),
	],
	providers: [
		{
			provide: MailNestjsService,
			useFactory: (mailerService: MailerService) => {
				return new MailNestjsService(mailerService);
			},
			inject: [MailerService],
		},
	],
	exports: [MailNestjsService],
})
export class MailServiceModule {}
