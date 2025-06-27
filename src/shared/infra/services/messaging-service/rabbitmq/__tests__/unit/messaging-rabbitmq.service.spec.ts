import { MessagingRabbitmqService } from '../../messaging-rabbitmq.service';

describe('MessagingRabbitmqService', () => {
	let sut: MessagingRabbitmqService;
	let client: any;

	beforeEach(() => {
		client = {
			emit: jest.fn(),
		};
		sut = new MessagingRabbitmqService(client);
	});

	it('should call client.emit and resolve in publish', async () => {
		const topic = 'test-topic';
		const message = { foo: 'bar' };
		client.emit.mockReturnValue({
			toPromise: () => Promise.resolve(),
			subscribe: jest.fn(),
		});
		jest
			.spyOn(require('rxjs'), 'firstValueFrom')
			.mockImplementation((obs: any) => obs.toPromise());

		await expect(sut.publish(topic, message)).resolves.toBeUndefined();
		expect(client.emit).toHaveBeenCalledWith(topic, message);
	});

	it('should propagate errors from client.emit in publish', async () => {
		const topic = 'test-topic';
		const message = { foo: 'bar' };
		const error = new Error('emit failed');
		client.emit.mockReturnValue({
			toPromise: () => Promise.reject(error),
			subscribe: jest.fn(),
		});
		jest
			.spyOn(require('rxjs'), 'firstValueFrom')
			.mockImplementation((obs: any) => obs.toPromise());

		await expect(sut.publish(topic, message)).rejects.toThrow(error);
	});

	it('should return result from exec in handleErrors', async () => {
		const exec = jest.fn().mockResolvedValue('ok');
		const result = await sut.handleErrors(exec);
		expect(result).toBe('ok');
	});

	it('should return null and log error if exec throws in handleErrors', async () => {
		const error = new Error('fail');
		const exec = jest.fn().mockRejectedValue(error);
		const consoleSpy = jest
			.spyOn(console, 'error')
			.mockImplementation(() => {});

		const result = await sut.handleErrors(exec);

		expect(result).toBeNull();
		expect(consoleSpy).toHaveBeenCalledWith('TenantController ~ error:', error);

		consoleSpy.mockRestore();
	});
});
