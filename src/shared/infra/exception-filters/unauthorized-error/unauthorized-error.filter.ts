import { UnauthorizedError } from '@/shared/application/errors/unauthorized-error';
import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpStatus,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch(UnauthorizedError)
export class UnauthorizedErrorFilter implements ExceptionFilter {
	catch(exception: UnauthorizedError, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<FastifyReply>();

		response.status(HttpStatus.UNAUTHORIZED).send({
			statusCode: HttpStatus.UNAUTHORIZED,
			error: 'Unauthorized Error',
			message: exception.message,
		});
	}
}
