import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EnvConfigService } from './shared/infra/env-config/env-config.service';
import { BadRequestErrorFilter } from './shared/infra/exception-filters/bad-request-error/bad-request-error.filter';
import { EntityValidationErrorFilter } from './shared/infra/exception-filters/entity-validation-error/entity-validation-error.filter';
import { GlobalErrorFilter } from './shared/infra/exception-filters/global-error/global-error.filter';

export function applyGlobalConfigs(
	app: INestApplication,
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
	);
}
