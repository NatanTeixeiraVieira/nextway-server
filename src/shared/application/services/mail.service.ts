export type MailOptions = {
	to: string;
	subject: string;
	content: string;
};

export interface MailService {
	sendMail(mailOptions: MailOptions): Promise<void>;
}
