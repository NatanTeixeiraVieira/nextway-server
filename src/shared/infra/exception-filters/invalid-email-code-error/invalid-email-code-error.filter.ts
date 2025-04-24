import { InvalidEmailCodeError } from '@/shared/application/errors/invalid-email-code-error';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch(InvalidEmailCodeError)
export class InvalidEmailCodeErrorFilter implements ExceptionFilter {
	catch(exception: InvalidEmailCodeError, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<FastifyReply>();

		response.status(400).send({
			statusCode: 400,
			error: 'Invalid Email Error',
			message: exception.message,
		});
	}
}
