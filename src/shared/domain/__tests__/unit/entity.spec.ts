import { Entity } from '../../entities/entity';

type StubProps = {
	prop1: string;
	prop2: number;
};

class StubEntity extends Entity<StubProps> {}

describe('Entity unit tests', () => {
	it('should test id generation in constructor', () => {
		const props: StubProps = {
			prop1: 'value1',
			prop2: 21,
		};

		const entity = new StubEntity(props);

		expect(entity['_id']).toBeTruthy();
	});

	it('should set props in with method', () => {
		const props: StubProps = {
			prop1: 'value1',
			prop2: 21,
		};

    const id = '25113aa4-a82a-4018-9726-ed9606afcb91'

		const entity = StubEntity.with({...props, id});

		expect(entity['props']).toStrictEqual(props);
	});

  it('Should convert a entity to a Javascript Object', () => {
    const props = {
      id: '25113aa4-a82a-4018-9726-ed9606afcb91',
			prop1: 'value1',
			prop2: 21,
		};
		const entity = StubEntity.with(props);

    expect(entity.toJSON()).toStrictEqual(props)
  })

  it('Should get id (getter)', () => {
    const props = {
      id: '25113aa4-a82a-4018-9726-ed9606afcb91',
			prop1: 'value1',
			prop2: 21,
		};
		const entity = StubEntity.with(props);

    expect(entity.id).toBe(props.id)
  })
});
