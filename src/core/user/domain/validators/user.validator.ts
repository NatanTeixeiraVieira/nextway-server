import {
	IsBoolean,
	IsDate,
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	Length,
	Matches,
	MaxLength,
	ValidatorFields,
} from '@/shared/domain/validators/validator-fields';
import { UserProps } from '../entities/user.entity';

export class UserRules {
	@MaxLength(255)
	@IsString()
	@IsNotEmpty()
	name: string;

	@MaxLength(255)
	@IsString()
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@MaxLength(100)
	@IsString()
	@IsNotEmpty()
	password: string;

	@IsString()
	@IsOptional()
	@Length(13, 13)
	@Matches(/^\d+$/)
	phoneNumber: string | null;

	@IsDate()
	@IsOptional()
	emailVerified: Date | null;

	@IsString()
	@IsOptional()
	forgotPasswordEmailVerificationToken: string | null;

	@IsBoolean()
	@IsNotEmpty()
	active: boolean;

	constructor({
		active,
		email,
		emailVerified,
		forgotPasswordEmailVerificationToken,
		name,
		password,
		phoneNumber,
	}: UserProps) {
		Object.assign(this, {
			active,
			email,
			emailVerified,
			forgotPasswordEmailVerificationToken,
			name,
			password,
			phoneNumber,
		});
	}
}

export class UserValidator extends ValidatorFields<UserRules> {
	validate(data: UserRules): boolean {
		return super.validate(new UserRules(data ?? ({} as UserProps)));
	}
}

export class UserValidatorFactory {
	create(): UserValidator {
		return new UserValidator();
	}
}
