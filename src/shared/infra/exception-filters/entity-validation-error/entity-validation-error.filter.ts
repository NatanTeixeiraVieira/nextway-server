import { EntityValidationError } from '@/shared/domain/errors/validation-error';
import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpStatus,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch(EntityValidationError)
export class EntityValidationErrorFilter implements ExceptionFilter {
	catch(exception: EntityValidationError, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<FastifyReply>();

		response.status(HttpStatus.UNPROCESSABLE_ENTITY).send({
			statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
			error: 'Unprocessable Entity',
			message: exception.error,
		});
	}
}
