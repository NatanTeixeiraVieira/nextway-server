import { Entity } from '@/shared/domain/entities/entity';
import { EntityValidationError } from '@/shared/domain/errors/validation-error';
import { UserValidatorFactory } from '../validators/user.validator';

export type UserProps = {
	name: string;
	email: string;
	password: string;
	phoneNumber: string | null;
	emailVerified: Date | null;
	forgotPasswordEmailVerificationToken: string | null;
	active: boolean;
};

export type RegisterProps = {
	name: string;
	email: string;
	password: string;
};

export class User extends Entity<UserProps> {
	static register(registerProps: RegisterProps): User {
		const userProps: UserProps = {
			active: false,
			name: registerProps.name,
			email: registerProps.email,
			password: registerProps.password,
			emailVerified: null,
			forgotPasswordEmailVerificationToken: null,
			phoneNumber: null,
		};

		User.validate(userProps);

		return new User(userProps);
	}

	private static validate(props: UserProps) {
		const userValidatorFactory = new UserValidatorFactory();
		const validator = userValidatorFactory.create();
		const isValid = validator.validate(props);

		if (!isValid) {
			throw new EntityValidationError(validator.errors);
		}
	}
}
