import { faker } from '@faker-js/faker';
import { UserProps } from '../../entities/user.entity';

export function UserDataBuilder(props?: Partial<UserProps>): UserProps {
	return {
		name: props.name ?? faker.person.fullName(),
		email: props.email ?? faker.internet.email(),
		password: props.password ?? faker.internet.password(),
		phoneNumber: props.phoneNumber ?? faker.string.numeric(13),
		emailVerified: props.emailVerified ?? new Date() ?? null,
		forgotPasswordEmailVerificationToken:
			props.forgotPasswordEmailVerificationToken ??
			crypto.randomUUID().toString(),
		active: props.active ?? faker.datatype.boolean(),
	};
}
