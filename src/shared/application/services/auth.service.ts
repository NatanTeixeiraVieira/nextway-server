import { User } from '@/core/user/domain/entities/user.entity';
import { ClearCookies, SetCookies } from '../types/cookies';

export type Authenticate = {
	accessToken: string;
	refreshToken: string;
};

export type Refresh = {
	accessToken: string;
};

export type SetTokensInCookiesProps = {
	accessToken: string;
	refreshToken: string;
	setCookies: SetCookies;
};

export type SetAccessTokenInCookies = {
	accessToken: string;
	setCookies: SetCookies;
};

export type ClearAuthCookiesProps = {
	clearCookies: ClearCookies;
};

export type AuthenticatePayload = {
	sub: string;
};

export interface AuthService {
	authenticate(user: User): Promise<Authenticate>;
	refresh(user: User): Promise<Refresh>;
	setTokensInCookies(props: SetTokensInCookiesProps): void;
	setAccessTokenInCookies(props: SetAccessTokenInCookies): void;
	clearAuthCookies(props: ClearAuthCookiesProps): void;
}
