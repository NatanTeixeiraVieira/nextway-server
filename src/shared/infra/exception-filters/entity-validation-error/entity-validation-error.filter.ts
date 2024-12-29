import { EntityValidationError } from '@/shared/domain/errors/validation-error';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch(EntityValidationError)
export class EntityValidationErrorFilter implements ExceptionFilter {
	catch(exception: EntityValidationError, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<FastifyReply>();

		response.status(422).send({
			statusCode: 422,
			error: 'Unprocessable Entity',
			message: exception.error,
		});
	}
}
