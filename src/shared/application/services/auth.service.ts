import { User } from '@/core/user/domain/entities/user.entity';
import { SetCookies } from '../types/cookies';

export type Authenticate = {
	accessToken: string;
	refreshToken: string;
};

export type SetTokensInCookiesProps = {
	accessToken: string;
	refreshToken: string;
	setCookies: SetCookies;
};

export type AuthenticatePayload = {
	sub: string;
};

export interface AuthService {
	authenticate(user: User): Promise<Authenticate>;
	setTokensInCookies(props: SetTokensInCookiesProps): void;
}
