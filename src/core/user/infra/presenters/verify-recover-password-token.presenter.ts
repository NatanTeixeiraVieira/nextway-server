import { ApiProperty } from '@nestjs/swagger';
import { Output } from '../../application/usecases/recover-password/verify-recover-password-token.usecase';

export class VerifyRecoverPasswordTokenPresenter {
	@ApiProperty({ description: 'Is token valid or not' })
	readonly isValid: boolean;

	constructor(output: Output) {
		this.isValid = output.isValid;
	}
}
