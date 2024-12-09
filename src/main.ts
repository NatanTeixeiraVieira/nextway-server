import { NestFactory } from '@nestjs/core';
import {
	FastifyAdapter,
	type NestFastifyApplication,
} from '@nestjs/platform-fastify';
import {
	initializeTransactionalContext,
	StorageDriver,
} from 'typeorm-transactional';
import { AppModule } from './app.module';
import { applyGlobalConfigs } from './global-configs';
import { EnvConfigService } from './shared/infra/env-config/env-config.service';

async function bootstrap() {
	// Config transactions
	initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter(),
	);

	const envConfigService = app.get(EnvConfigService);

	applyGlobalConfigs();

	await app.listen(envConfigService.getPort(), '0.0.0.0');
}

bootstrap();
