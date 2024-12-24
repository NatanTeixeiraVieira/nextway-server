import { MailOptions } from '@/shared/application/services/mail.service';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailNestService } from '../../mail-nestjs.service';

jest.mock('@nestjs-modules/mailer');

describe('EmailNestService unit tests', () => {
	let sut: EmailNestService;
	let mailerService: MailerService;

	beforeEach(() => {
		mailerService = new MailerService(
			{
				transport: {
					host: 'smtp.default.com',
					port: 465,
					secure: true,
					auth: {
						user: 'test_user',
						pass: 'test_pass',
					},
				},
			},
			{ createTransport: () => {} },
		);
		sut = new EmailNestService(mailerService);
	});

	it('should send an email', async () => {
		const mailOptions: MailOptions = {
			to: 'test@example.com',
			subject: 'Test Subject',
			content: '<p>Test Content</p>',
		};

		const sendMailSpy = jest.spyOn(mailerService, 'sendMail');

		await sut.sendMail(mailOptions);

		expect(sendMailSpy).toHaveBeenCalledWith({
			to: mailOptions.to,
			html: mailOptions.content,
			subject: mailOptions.subject,
		});
		expect(sendMailSpy).toHaveBeenCalledTimes(1);
	});
});
