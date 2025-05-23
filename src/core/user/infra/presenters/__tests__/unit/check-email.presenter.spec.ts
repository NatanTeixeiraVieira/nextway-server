import { Output } from '@/core/user/application/usecases/register.usecase';
import { UserDataBuilder } from '@/core/user/domain/testing/helpers/user-data-builder';
import { instanceToPlain } from 'class-transformer';
import { CheckEmailPresenter } from '../../check-email.presenter';

describe('CheckEmailPresenter unit tests', () => {
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
	let sut: CheckEmailPresenter;

	beforeEach(() => {
		sut = new CheckEmailPresenter(props);
	});

	it('should set values', () => {
		expect(sut.id).toBe(props.id);
		expect(sut.email).toBe(props.email);
	});

	it('should presenter check email data', () => {
		const output = instanceToPlain(sut);
		expect(output).toStrictEqual({
			id: props.id,
			email: props.email,
		});
	});
});
