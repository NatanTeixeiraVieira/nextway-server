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

	it('Should convert a entity to a Javascript Object', () => {
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

	it('Should get id (getter)', () => {
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

	it('Should get audit (getter)', () => {
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
});
