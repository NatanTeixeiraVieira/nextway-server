import { StateProps } from '@/shared/domain/entities/state.entity';
import {
	StateRules,
	StateValidator,
	StateValidatorFactory,
} from '../../state.validator';

let sut: StateValidator;
let props: StateProps;

describe('StateValidator unit tests', () => {
	beforeEach(() => {
		const stateValidatorFactory = new StateValidatorFactory();
		sut = stateValidatorFactory.create();
		props = {
			id: 'state-id-123',
			name: 'Paraná',
			uf: 'PR',
		};
	});

	it('should test invalidation cases for id field', () => {
		let isValid = sut.validate(null as any);
		expect(isValid).toBeFalsy();
		expect(sut.errors?.['id']).toStrictEqual([
			'id must be shorter than or equal to 255 characters',
			'id should not be empty',
			'id must be a string',
		]);

		isValid = sut.validate({ ...props, id: '' });
		expect(isValid).toBeFalsy();
		expect(sut.errors?.['id']).toStrictEqual(['id should not be empty']);

		isValid = sut.validate({ ...props, id: 10 as any });
		expect(isValid).toBeFalsy();
		expect(sut.errors?.['id']).toStrictEqual([
			'id must be shorter than or equal to 255 characters',
			'id must be a string',
		]);

		isValid = sut.validate({ ...props, id: 'a'.repeat(256) });
		expect(isValid).toBeFalsy();
		expect(sut.errors?.['id']).toStrictEqual([
			'id must be shorter than or equal to 255 characters',
		]);
	});

	it('should test invalidation cases for name field', () => {
		let isValid = sut.validate(null as any);
		expect(isValid).toBeFalsy();
		expect(sut.errors?.['name']).toStrictEqual([
			'name must be shorter than or equal to 20 characters',
			'name should not be empty',
			'name must be a string',
		]);

		isValid = sut.validate({ ...props, name: '' });
		expect(isValid).toBeFalsy();
		expect(sut.errors?.['name']).toStrictEqual(['name should not be empty']);

		isValid = sut.validate({ ...props, name: 10 as any });
		expect(isValid).toBeFalsy();
		expect(sut.errors?.['name']).toStrictEqual([
			'name must be shorter than or equal to 20 characters',
			'name must be a string',
		]);

		isValid = sut.validate({ ...props, name: 'a'.repeat(21) });
		expect(isValid).toBeFalsy();
		expect(sut.errors?.['name']).toStrictEqual([
			'name must be shorter than or equal to 20 characters',
		]);
	});

	it('should test invalidation cases for uf field', () => {
		let isValid = sut.validate(null as any);
		expect(isValid).toBeFalsy();
		expect(sut.errors?.['uf']).toStrictEqual([
			'uf must be shorter than or equal to 2 characters',
			'uf should not be empty',
			'uf must be a string',
		]);

		isValid = sut.validate({ ...props, uf: '' });
		expect(isValid).toBeFalsy();
		expect(sut.errors?.['uf']).toStrictEqual(['uf should not be empty']);

		isValid = sut.validate({ ...props, uf: 10 as any });
		expect(isValid).toBeFalsy();
		expect(sut.errors?.['uf']).toStrictEqual([
			'uf must be shorter than or equal to 2 characters',
			'uf must be a string',
		]);

		isValid = sut.validate({ ...props, uf: 'ABC' });
		expect(isValid).toBeFalsy();
		expect(sut.errors?.['uf']).toStrictEqual([
			'uf must be shorter than or equal to 2 characters',
		]);
	});

	it('should test valid cases for state rules', () => {
		const isValid = sut.validate(props);
		expect(isValid).toBeTruthy();
		expect(sut.validatedData).toStrictEqual(new StateRules(props));
	});
});
