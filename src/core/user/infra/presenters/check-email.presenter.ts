import { ApiProperty } from '@nestjs/swagger';
import { Output } from '../../application/usecases/register.usecase';

export class CheckEmailPresenter {
	@ApiProperty({ description: 'User ID' })
	id: string;

	@ApiProperty({ description: 'User email' })
	email: string;

	constructor(output: Output) {
		this.id = output.id;
		this.email = output.email;
	}
}
