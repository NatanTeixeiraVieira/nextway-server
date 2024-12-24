import { EnvConfig } from '@/shared/application/env-config/env-config';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { EnvConfigService } from '../../env-config/env-config.service';
import { EmailNestService } from './nestjs/mail-nestjs.service';

@Module({
	imports: [
		MailerModule.forRootAsync({
			useFactory: (envConfig: EnvConfig) => ({
				transport: {
					host: 'smtp.default.com',
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
	providers: [EmailNestService],
})
export class MailServiceModule {}
