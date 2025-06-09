import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	Logger,
} from '@nestjs/common';

@Catch()
export class GlobalErrorFilter implements ExceptionFilter {
	private readonly logger = new Logger(GlobalErrorFilter.name);
	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();

		if (exception instanceof HttpException) {
			const responseBody = exception.getResponse();
			return response.status(exception.getStatus()).send(responseBody);
		}

		let exceptionDetails: string;

		if (exception instanceof Error) {
			exceptionDetails = JSON.stringify({
				message: exception.message,
				stack: exception.stack,
				name: exception.name,
			});
		} else {
			exceptionDetails = JSON.stringify(exception);
		}

		this.logger.error(`Erro desconhecido ocorreu: ${exceptionDetails}`);

		response.status(500).send({
			statusCode: 500,
			error: 'Internal Server Error',
			message:
				exception instanceof Error
					? exception.message
					: JSON.stringify(exception),
		});
	}
}
