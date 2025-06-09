import { Providers } from '@/shared/application/constants/providers';
import { MessagingRabbitmqService } from './rabbitmq/messaging-rabbitmq.service';

import { getMessagingBrokerConfigs } from '@/global-configs';
import { EnvConfig } from '@/shared/application/env-config/env-config';
import { Global, Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { EnvConfigModule } from '../../env-config/env-config.module';
import { CommonMessagingService } from './common-messaging.service';
import { MessagingProviders } from './constants/providers';

@Global()
@Module({
	imports: [
		ClientsModule.registerAsync([
			{
				name: MessagingProviders.MESSAGE_BROKER_INFRA_SERVICE,
				imports: [EnvConfigModule],
				useFactory: (envConfigService: EnvConfig) =>
					getMessagingBrokerConfigs(envConfigService),
				inject: [Providers.ENV_CONFIG_SERVICE],
			},
		]),
	],
	providers: [
		CommonMessagingService,
		{
			provide: Providers.MESSAGING_SERVICE,
			useClass: MessagingRabbitmqService,
		},
	],
	exports: [Providers.MESSAGING_SERVICE, ClientsModule, CommonMessagingService],
})
export class MessagingModule {}
