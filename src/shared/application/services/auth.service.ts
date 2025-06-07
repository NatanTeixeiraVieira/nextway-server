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
	accessTokenName: string;
	refreshToken: string;
	refreshTokenName: string;
	setCookies: SetCookies;
	refreshTokenPath: string;
	accessTokenPath: string;
};

export type SetAccessTokenInCookies = {
	accessToken: string;
	accessTokenPath: string;
	accessTokenName: string;
	setCookies: SetCookies;
};

export type ClearAuthCookiesProps = {
	accessTokenName: string;
	refreshTokenName: string;
	accessTokenPath: string;
	refreshTokenPath: string;
	clearCookies: ClearCookies;
};

export type AuthenticatePayload = {
	sub: string;
	email: string;
};

export type BaseClient = {
	id: string;
	email: string;
};

export interface AuthService {
	authenticate<Client extends BaseClient>(user: Client): Promise<Authenticate>;
	refresh<Client extends BaseClient>(user: Client): Promise<Refresh>;
	setTokensInCookies(props: SetTokensInCookiesProps): void;
	setAccessTokenInCookies(props: SetAccessTokenInCookies): void;
	clearAuthCookies(props: ClearAuthCookiesProps): void;
}
