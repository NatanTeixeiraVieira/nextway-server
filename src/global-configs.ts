import fastifyCookie from '@fastify/cookie';
import { ValidationPipe } from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EnvConfigService } from './shared/infra/env-config/env-config.service';
import { BadRequestErrorFilter } from './shared/infra/exception-filters/bad-request-error/bad-request-error.filter';
import { EntityValidationErrorFilter } from './shared/infra/exception-filters/entity-validation-error/entity-validation-error.filter';
import { GlobalErrorFilter } from './shared/infra/exception-filters/global-error/global-error.filter';
import { InvalidTokenErrorFilter } from './shared/infra/exception-filters/invalid-token-error/invalid-token-error.filter';
import { NotFoundErrorFilter } from './shared/infra/exception-filters/not-found-error/not-found-error.filter';

export async function applyGlobalConfigs(
	app: NestFastifyApplication,
	envConfigService: EnvConfigService,
) {
	// Swagger configs
	if (envConfigService.getNodeEnv() === 'development') {
		const config = new DocumentBuilder()
			.setTitle('Nextway')
			.setDescription('Nextway Delivery')
			.setVersion('1.0.0')
			.addCookieAuth('auth')
			.build();
		const document = SwaggerModule.createDocument(app, config);
		SwaggerModule.setup('api/docs', app, document);
	}

	// Cors configs
	app.enableCors({
		origin: envConfigService.getOrigin(),
		methods: envConfigService.getAllowedMethods(),
		preflightContinue: false,
		optionsSuccessStatus: 204,
		credentials: true,
	});

	// Cookies config
	await app.register(fastifyCookie, {
		secret: envConfigService.getCookiesSecret(),
	});

	// Global pipes config
	app.useGlobalPipes(
		new ValidationPipe({
			errorHttpStatusCode: 422,
			forbidNonWhitelisted: true,
			transform: true,
		}),
	);

	// Error filters configs
	app.useGlobalFilters(
		new GlobalErrorFilter(),
		new BadRequestErrorFilter(),
		new EntityValidationErrorFilter(),
		new NotFoundErrorFilter(),
		new InvalidTokenErrorFilter(),
	);
}
