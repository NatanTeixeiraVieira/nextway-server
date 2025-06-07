import { Providers } from '@/shared/application/constants/providers';
import { MessagingRabbitmqService } from './rabbitmq/messaging-rabbitmq.service';

import { Module } from '@nestjs/common';

@Module({
	providers: [
		{
			provide: Providers.MESSAGING_SERVICE,
			useClass: MessagingRabbitmqService,
		},
	],
	exports: [Providers.MESSAGING_SERVICE],
})
export class MessagingModule {}
