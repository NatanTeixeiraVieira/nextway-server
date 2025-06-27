import { CommonMessagingService } from '../../common-messaging.service';

describe('CommonMessagingService unit tests', () => {
	let sut: CommonMessagingService;

	beforeEach(() => {
		sut = new CommonMessagingService();
	});

	it('should call channel.ack with the original message', () => {
		const ackMock = jest.fn();
		const originalMsg = { foo: 'bar' };
		const channel = { ack: ackMock };
		const context = {
			getChannelRef: jest.fn().mockReturnValue(channel),
			getMessage: jest.fn().mockReturnValue(originalMsg),
		};

		sut.ack(context as any);

		expect(context.getChannelRef).toHaveBeenCalledTimes(1);
		expect(context.getMessage).toHaveBeenCalledTimes(1);
		expect(ackMock).toHaveBeenCalledTimes(1);
		expect(ackMock).toHaveBeenCalledWith(originalMsg);
	});
});
