import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
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

	app.connectMicroservice<MicroserviceOptions>({
		transport: Transport.RMQ,
		options: {
			queue: envConfigService.getMessagingBrokerQueueName(),
			urls: envConfigService.getMessagingBrokerUrls(),
			noAck: false,
			queueOptions: {
				durable: false,
			},
			// persistent: true,
		},
	});

	await applyGlobalConfigs(app, envConfigService);

	await app.startAllMicroservices();

	await app.listen(envConfigService.getPort(), '0.0.0.0');
}

bootstrap();
