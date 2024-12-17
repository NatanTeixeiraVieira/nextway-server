import { Entity, EntityProps } from '@/shared/domain/entities/entity';

export type UserProps = EntityProps & {
	name: string;
	email: string;
	password: string;
	phoneNumber: string | null;
	emailVerified: Date | null;
	forgotPasswordEmailVerificationToken: string | null;
	active: boolean;
};

type RegisterProps = {
	name: string;
	email: string;
	password: string;
};

export class User extends Entity<UserProps> {
	static register(registerProps: RegisterProps): void {}
}
