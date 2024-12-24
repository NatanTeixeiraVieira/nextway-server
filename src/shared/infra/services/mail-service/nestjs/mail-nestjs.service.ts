import {
	MailOptions,
	MailService,
} from '@/shared/application/services/mail.service';
import { MailerService } from '@nestjs-modules/mailer';

export class EmailNestService implements MailService {
	constructor(private readonly mailerService: MailerService) {}

	async sendMail(mailOptions: MailOptions): Promise<void> {
		await this.mailerService.sendMail({
			to: mailOptions.to,
			html: mailOptions.content,
			subject: mailOptions.subject,
		});
	}
}
