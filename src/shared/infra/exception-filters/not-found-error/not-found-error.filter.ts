import { NotFoundError } from '@/shared/application/errors/not-found-error';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch(NotFoundError)
export class NotFoundErrorFilter implements ExceptionFilter {
	catch(exception: NotFoundError, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<FastifyReply>();

		response.status(404).send({
			statusCode: 404,
			error: 'Not Found Error',
			message: exception.message,
		});
	}
}
