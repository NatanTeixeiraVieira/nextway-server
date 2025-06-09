import { Injectable } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';

@Injectable()
export class CommonMessagingService {
	ack(context: RmqContext): void {
		const channel = context.getChannelRef();
		const originalMsg = context.getMessage();
		channel.ack(originalMsg);
	}
}
