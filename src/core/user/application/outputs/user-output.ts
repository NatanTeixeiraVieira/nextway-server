import { OutputMapper } from '@/shared/application/outputs/output-mapper';
import { Audit } from '@/shared/domain/entities/entity';
import { User } from '../../domain/entities/user.entity';

export type UserOutput = {
	id: string;
	name: string;
	email: string;
	password: string;
	phoneNumber: string | null;
	emailVerified: Date | null;
	forgotPasswordEmailVerificationToken: string | null;
	active: boolean;
	audit: Audit;
};

export class UserOutputMapper extends OutputMapper<User, UserOutput> {}
