import { MessagingService } from '@/shared/application/services/messaging.service';

export class MessagingRabbitmqService implements MessagingService {
	async publish(topic: string, message: unknown): Promise<void> {
		console.log('🚀 ~ MessagingRabbitmqService ~ publish ~ message:', message);
		console.log('🚀 ~ MessagingRabbitmqService ~ publish ~ topic:', topic);
	}
	async subscribe(
		topic: string,
		callback: (message: unknown) => void,
	): Promise<void> {
		console.log('🚀 ~ MessagingRabbitmqService ~ topic:', topic);
	}
}
