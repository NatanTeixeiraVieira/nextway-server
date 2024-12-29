import { ApiProperty } from '@nestjs/swagger';
import { Output } from '../../application/usecases/register.usecase';

export class RegisterPresenter {
	@ApiProperty({ description: 'Created user ID' })
	id: string;

	constructor(output: Output) {
		this.id = output.id;
	}
}
