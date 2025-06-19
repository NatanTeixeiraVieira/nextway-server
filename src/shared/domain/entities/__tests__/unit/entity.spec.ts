import { DomainEvent } from '@/shared/domain/events/domain-event';
import { Audit, Entity } from '../../entity';

type StubProps = {
	prop1: string;
	prop2: number;
};

class StubEntity extends Entity<StubProps> {}

describe('Entity unit tests', () => {
	it('should test generation values in constructor', () => {
		const props: StubProps = {
			prop1: 'value1',
			prop2: 21,
		};

		const entity = new StubEntity(props);

		expect(entity['props'].id).toBeTruthy();

		expect(entity['props'].audit.createdAt).toBeTruthy();
		expect(entity['props'].audit.createdAt).toBeInstanceOf(Date);

		expect(entity['props'].audit.updatedAt).toBeTruthy();
		expect(entity['props'].audit.updatedAt).toBeInstanceOf(Date);

		expect(entity['props'].audit.deletedAt).toBeNull();
	});

	it('should set props in with method', () => {
		const props: StubProps = {
			prop1: 'value1',
			prop2: 21,
		};

		const audit: Audit = {
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: new Date(),
		};

		const id = '25113aa4-a82a-4018-9726-ed9606afcb91';

		const entity = StubEntity.with<StubProps, StubEntity>({
			...props,
			id,
			audit,
		});

		expect(entity['props']).toStrictEqual({ ...props, id, audit });
	});

	it('should convert a entity to a Javascript Object', () => {
		const props = {
			id: '25113aa4-a82a-4018-9726-ed9606afcb91',
			prop1: 'value1',
			prop2: 21,
			audit: {
				createdAt: new Date(),
				updatedAt: new Date(),
				deletedAt: new Date(),
			},
		};
		const entity = StubEntity.with<StubProps, StubEntity>(props);

		expect(entity.toJSON()).toStrictEqual(props);
	});

	it('should mark entity as deleted', () => {
		const props = {
			id: '25113aa4-a82a-4018-9726-ed9606afcb91',
			prop1: 'value1',
			prop2: 21,
			audit: {
				createdAt: new Date(),
				updatedAt: new Date(),
				deletedAt: null,
			},
		};

		const entity = StubEntity.with<StubProps, StubEntity>(props);
		entity['markAsDeleted']();
		expect(entity.audit.deletedAt).toBeInstanceOf(Date);
	});

	it('should update the entity updatedAt', () => {
		const props = {
			id: '25113aa4-a82a-4018-9726-ed9606afcb91',
			prop1: 'value1',
			prop2: 21,
			audit: {
				createdAt: new Date(),
				updatedAt: 'new Date()' as any,
				deletedAt: new Date(),
			},
		};

		const entity = StubEntity.with<StubProps, StubEntity>(props);
		entity['updateTimestamp']();
		expect(entity.audit.updatedAt).toBeInstanceOf(Date);
	});

	it('should get id (getter)', () => {
		const props = {
			id: '25113aa4-a82a-4018-9726-ed9606afcb91',
			prop1: 'value1',
			prop2: 21,
			audit: {
				createdAt: new Date(),
				updatedAt: new Date(),
				deletedAt: new Date(),
			},
		};
		const entity = StubEntity.with<StubProps, StubEntity>(props);

		expect(entity.id).toBe(props.id);
	});

	it('should get audit (getter)', () => {
		const props = {
			id: '25113aa4-a82a-4018-9726-ed9606afcb91',
			prop1: 'value1',
			prop2: 21,
			audit: {
				createdAt: new Date(),
				updatedAt: new Date(),
				deletedAt: new Date(),
			},
		};
		const entity = StubEntity.with<StubProps, StubEntity>(props);

		expect(entity.audit).toStrictEqual(props.audit);

		expect(entity.audit.createdAt).toBe(props.audit.createdAt);
		expect(entity.audit.updatedAt).toBe(props.audit.updatedAt);
		expect(entity.audit.deletedAt).toBe(props.audit.deletedAt);
	});

	it('should add a domain event', () => {
		const props = {
			id: '25113aa4-a82a-4018-9726-ed9606afcb91',
			prop1: 'value1',
			prop2: 21,
			audit: {
				createdAt: new Date(),
				updatedAt: new Date(),
				deletedAt: null,
			},
		};
		const entity = StubEntity.with<StubProps, StubEntity>(props);

		const event = { type: 'EVENT_1' } as unknown as DomainEvent;
		entity['addDomainEvent'](event);

		expect(entity['events']).toEqual([event]);
	});

	it('should pull and clear domain events', () => {
		const props = {
			id: '25113aa4-a82a-4018-9726-ed9606afcb91',
			prop1: 'value1',
			prop2: 21,
			audit: {
				createdAt: new Date(),
				updatedAt: new Date(),
				deletedAt: null,
			},
		};
		const entity = StubEntity.with<StubProps, StubEntity>(props);

		const event = { type: 'EVENT_2' } as unknown as DomainEvent;
		entity['addDomainEvent'](event);

		const pulled = entity.pullDomainEvents();
		expect(pulled).toEqual([event]);
		expect(entity['events']).toEqual([]);
	});
});
