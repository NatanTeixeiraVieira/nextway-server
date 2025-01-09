import { NestFactory } from '@nestjs/core';
import {
	FastifyAdapter,
	NestFastifyApplication,
} from '@nestjs/platform-fastify';
import {
	initializeTransactionalContext,
	StorageDriver,
} from 'typeorm-transactional';
import { AppModule } from './app.module';
import { applyGlobalConfigs } from './global-configs';
import { Providers } from './shared/application/constants/providers';

async function bootstrap() {
	// Config transactions
	initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter(),
	);
	const envConfigService = app.get(Providers.ENV_CONFIG_SERVICE);

	await applyGlobalConfigs(app, envConfigService);

	await app.listen(envConfigService.getPort(), '0.0.0.0');
}

bootstrap();
