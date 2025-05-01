import { Schema } from '@/shared/infra/database/typeorm/schemas/schema';
import { Column, Entity, Index } from 'typeorm';

@Entity('user')
@Index('UQ_user_email_active', ['email'], {
	unique: true,
	where: '"deleted_at" IS NULL',
})
export class UserSchema extends Schema {
	@Column({ name: 'name', type: 'varchar', length: 255, nullable: false })
	name: string;

	@Column({
		name: 'email',
		type: 'varchar',
		length: 255,
		unique: true,
		nullable: false,
	})
	email: string;

	@Column({ name: 'password', type: 'varchar', length: 100, nullable: false })
	password: string;

	@Column({ name: 'phone_number', type: 'varchar', length: 13, nullable: true })
	phoneNumber: string | null;

	@Column({ name: 'email_verified', type: 'timestamp', nullable: true })
	emailVerified: Date | null;

	@Column({
		name: 'forgot_password_email_verification_token',
		type: 'varchar',
		length: 255,
		nullable: true,
	})
	forgotPasswordEmailVerificationToken: string | null;

	@Column({ name: 'active', type: 'boolean', default: false })
	active: boolean;
}
