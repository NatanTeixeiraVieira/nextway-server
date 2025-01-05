import { ApiProperty } from '@nestjs/swagger';
import { Output } from '../../application/usecases/register.usecase';

export class LoginPresenter {
	@ApiProperty({ description: 'Logged user ID' })
	readonly id: string;

	@ApiProperty({ description: 'User email' })
	readonly email: string;

	constructor(output: Output) {
		this.id = output.id;
		this.email = output.email;
	}
}
