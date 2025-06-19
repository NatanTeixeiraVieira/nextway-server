import { setTimeout } from 'node:timers/promises';
import { DomainEvent } from '../../domain-event';

type TestEventProps = { foo: string; bar: number };

class StubEvent extends DomainEvent<TestEventProps> {
	foo!: string;
	bar!: number;
}

describe('DomainEvent unit tests', () => {
	it('should assign props to the instance', () => {
		const event = new StubEvent({ foo: 'abc', bar: 123 });
		expect(event.foo).toBe('abc');
		expect(event.bar).toBe(123);
	});

	it('should set ocurredAt to a Date close to now', async () => {
		const before = new Date();
		await setTimeout(1000);
		const event = new StubEvent({ foo: 'abc', bar: 123 });
		await setTimeout(1000);
		const after = new Date();
		expect(event['ocurredAt']).toBeInstanceOf(Date);
		expect(event['ocurredAt'].getTime()).toBeGreaterThanOrEqual(
			before.getTime(),
		);
		expect(event['ocurredAt'].getTime()).toBeLessThanOrEqual(after.getTime());
	});
});
