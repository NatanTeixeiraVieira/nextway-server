import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class LoginDto {
	@ApiProperty({ description: 'User email, used in login' })
	@IsEmail()
	readonly email: string;

	@ApiProperty({
		description: 'User password, used in login',
	})
	@MinLength(8)
	readonly password: string;
}
