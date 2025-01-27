import { Output } from '@/core/user/application/usecases/recover-password/verify-recover-password-token.usecase';
import { instanceToPlain } from 'class-transformer';
import { VerifyRecoverPasswordTokenPresenter } from '../../verify-recover-password-token.presenter';

describe('VerifyRecoverPasswordTokenPresenter unit tests', () => {
	const props: Output = {
		isValid: true,
	};

	let sut: VerifyRecoverPasswordTokenPresenter;

	beforeEach(() => {
		sut = new VerifyRecoverPasswordTokenPresenter(props);
	});

	it('should set values', () => {
		expect(sut.isValid).toBe(props.isValid);
	});

	it('should presenter verify recover password token data', () => {
		const output = instanceToPlain(sut);
		expect(output).toStrictEqual({
			isValid: props.isValid,
		});
	});
});
