import { ApiProperty } from '@nestjs/swagger';
import { MinLength } from 'class-validator';

export class RegisterDto {
	@ApiProperty({ description: 'register user name' })
	readonly name: string;

	@ApiProperty({ description: 'register user email. It is used on user login' })
	readonly email: string;

	@ApiProperty({
		description: 'register user password. It is used on user login',
	})
	@MinLength(8)
	readonly password: string;
}
