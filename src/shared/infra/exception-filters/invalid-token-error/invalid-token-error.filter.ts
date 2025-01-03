import { InvalidTokenError } from '@/shared/application/errors/invalid-token-error';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch(InvalidTokenError)
export class InvalidTokenErrorFilter implements ExceptionFilter {
	catch(exception: InvalidTokenError, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<FastifyReply>();

		response.status(401).send({
			statusCode: 401,
			error: 'Invalid Token Error',
			message: exception.message,
		});
	}
}
