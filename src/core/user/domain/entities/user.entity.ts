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

type UpdateProfileProps = {
	name: string;
	phoneNumber: string;
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

	register(registerProps: RegisterProps): void {
		User.validate({ ...this.props, ...registerProps });
		this.name = registerProps.name;
		this.email = registerProps.email;
		this.password = registerProps.password;
	}

	checkEmail(): void {
		User.validate(this.props);
		this.emailVerified = new Date();
		this.active = true;
		this.updateTimestamp();
	}

	changePassword(password: string): void {
		User.validate({ ...this.props, password });
		this.password = password;
		this.forgotPasswordEmailVerificationToken = null;
		this.updateTimestamp();
	}

	updateProfile(updateProfileProps: UpdateProfileProps): void {
		User.validate({ ...this.props, ...updateProfileProps });
		this.name = updateProfileProps.name;
		this.phoneNumber = updateProfileProps.phoneNumber;
		this.updateTimestamp();
	}

	deleteAccount(): void {
		User.validate(this.props);
		this.markAsDeleted();
		this.updateTimestamp();
	}

	createEmailForgotPasswordEmailVerificationToken(token: string): void {
		this.forgotPasswordEmailVerificationToken = token;
	}

	get email(): string {
		return this.props.email;
	}

	get emailVerified(): Date | null {
		return this.props.emailVerified;
	}

	get active(): boolean {
		return this.props.active;
	}

	get name(): string {
		return this.props.name;
	}

	get phoneNumber(): string | null {
		return this.props.phoneNumber;
	}

	get password(): string {
		return this.props.password;
	}

	get forgotPasswordEmailVerificationToken(): string | null {
		return this.props.forgotPasswordEmailVerificationToken;
	}

	private set emailVerified(date: Date) {
		this.props.emailVerified = date;
	}

	private set active(status: boolean) {
		this.props.active = status;
	}

	private set name(name: string) {
		this.props.name = name;
	}

	private set phoneNumber(phoneNumber: string) {
		this.props.phoneNumber = phoneNumber;
	}

	private set password(password: string) {
		this.props.password = password;
	}

	private set email(email: string) {
		this.props.email = email;
	}

	private set forgotPasswordEmailVerificationToken(forgotPasswordEmailVerificationToken:
		| string
		| null) {
		this.props.forgotPasswordEmailVerificationToken =
			forgotPasswordEmailVerificationToken;
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
