import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class RecoverPasswordSendEmailDto {
	@ApiProperty({ description: 'User email, used in login' })
	@IsEmail()
	readonly email: string;
}
