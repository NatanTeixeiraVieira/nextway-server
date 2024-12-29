import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch(BadRequestError)
export class BadRequestErrorFilter implements ExceptionFilter {
	catch(exception: BadRequestError, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<FastifyReply>();

		response.status(400).send({
			statusCode: 400,
			error: 'Bad Request Error',
			message: exception.message,
		});
	}
}
