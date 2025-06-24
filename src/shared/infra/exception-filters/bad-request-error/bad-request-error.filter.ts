import { BadRequestError } from '@/shared/application/errors/bad-request-error';
import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpStatus,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch(BadRequestError)
export class BadRequestErrorFilter implements ExceptionFilter {
	catch(exception: BadRequestError, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<FastifyReply>();

		response.status(HttpStatus.BAD_REQUEST).send({
			statusCode: HttpStatus.BAD_REQUEST,
			error: 'Bad Request Error',
			message: exception.message,
		});
	}
}
