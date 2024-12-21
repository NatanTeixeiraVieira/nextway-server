import { Audit, Entity } from '@/shared/domain/entities/entity';
import { OutputMapper } from '../../output-mapper';

type StubProps = {
	prop1: string;
	prop2: number;
};

class StubEntity extends Entity<StubProps> {}

type StubOutput = {
	id: string;
	prop1: string;
	prop2: number;
	audit: {
		createdAt: Date;
		updatedAt: Date;
		deletedAt: Date | null;
	};
};

class StubOutputMapper extends OutputMapper<StubEntity, StubOutput> {}

describe('OutputMapper', () => {
	it('should map entity to output', () => {
		const props: StubProps = {
			prop1: 'value1',
			prop2: 21,
		};

		const audit: Audit = {
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: null,
		};

		const id = '25113aa4-a82a-4018-9726-ed9606afcb91';

		const entity = StubEntity.with<StubProps, StubEntity>({
			...props,
			id,
			audit,
		});

		const outputMapper = new StubOutputMapper();
		const output = outputMapper.toOutput(entity);

		expect(output).toStrictEqual({
			id,
			prop1: 'value1',
			prop2: 21,
			audit,
		});
	});
});
