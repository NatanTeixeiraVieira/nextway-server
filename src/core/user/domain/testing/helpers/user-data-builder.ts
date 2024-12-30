import { faker } from '@faker-js/faker';
import { UserProps } from '../../entities/user.entity';

export function UserDataBuilder(props?: Partial<UserProps>): UserProps {
	return {
		name: props?.name ?? faker.person.fullName(),
		email: props?.email ?? faker.internet.email(),
		password: props?.password ?? faker.internet.password(),
		phoneNumber:
			props?.phoneNumber === undefined
				? faker.string.numeric(13)
				: props.phoneNumber,
		emailVerified:
			props?.emailVerified === undefined ? new Date() : props?.emailVerified,
		forgotPasswordEmailVerificationToken:
			props?.forgotPasswordEmailVerificationToken === undefined
				? crypto.randomUUID().toString()
				: props.forgotPasswordEmailVerificationToken,
		active: props?.active ?? faker.datatype.boolean(),
	};
}
