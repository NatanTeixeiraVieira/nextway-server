import { AppModule } from '@/app.module';
import { applyGlobalConfigs } from '@/global-configs';
import { Providers } from '@/shared/application/constants/providers';
import {
	FastifyAdapter,
	NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import {
	initializeTransactionalContext,
	StorageDriver,
} from 'typeorm-transactional';

export async function appFastifyConfigTest() {
	initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

	const module: TestingModule = await Test.createTestingModule({
		imports: [AppModule],
	}).compile();

	const fastifyApp = module.createNestApplication<NestFastifyApplication>(
		new FastifyAdapter(),
	);

	const envConfigService = module.get(Providers.ENV_CONFIG_SERVICE);
	await applyGlobalConfigs(fastifyApp, envConfigService);

	await fastifyApp.init();

	await fastifyApp.getHttpAdapter().getInstance().ready();

	return { fastifyApp, module };
}
