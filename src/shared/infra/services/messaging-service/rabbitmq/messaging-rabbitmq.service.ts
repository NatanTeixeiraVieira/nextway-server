import { MessagingService } from '@/shared/application/services/messaging.service';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { MessagingProviders } from '../constants/providers';

export class MessagingRabbitmqService implements MessagingService {
	constructor(
		@Inject(MessagingProviders.MESSAGE_BROKER_INFRA_SERVICE)
		private readonly client: ClientProxy,
	) {}

	async publish(topic: string, message: unknown): Promise<void> {
		await firstValueFrom(this.client.emit(topic, message));
	}

	async handleErrors<T>(exec: () => Promise<T>): Promise<T | null> {
		try {
			return await exec();
		} catch (error) {
			console.error('TenantController ~ error:', error);
			return null;
		}
	}
}
