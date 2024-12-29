import { Output } from '@/core/user/application/usecases/register.usecase';
import { UserDataBuilder } from '@/core/user/domain/testing/helpers/user-data-builder';
import { instanceToPlain } from 'class-transformer';
import { RegisterPresenter } from '../../register.presenter';

describe('RegisterPresenter unit tests', () => {
	const createdAt = new Date();
	const updatedAt = new Date();
	const props: Output = {
		...UserDataBuilder(),
		id: '41874b8a-fecb-42f3-be8d-34912c78b6e2',
		audit: {
			createdAt,
			updatedAt,
			deletedAt: null,
		},
	};
	let sut: RegisterPresenter;

	beforeEach(() => {
		sut = new RegisterPresenter(props);
	});

	it('should set values', () => {
		expect(sut.id).toBe(props.id);
	});

	it('should presenter data', () => {
		const output = instanceToPlain(sut);
		expect(output).toStrictEqual({
			id: props.id,
		});
	});
});
