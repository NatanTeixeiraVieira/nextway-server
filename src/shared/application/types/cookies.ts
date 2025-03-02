export type CookiesOptions = {
	maxAge: number;
	httpOnly: boolean;
	secure: boolean;
	sameSite: string;
	path?: string;
};

export type SetCookies = (
	name: string,
	value: string,
	options: CookiesOptions,
) => void;

export type ClearCookies = (name: string, options: CookiesOptions) => void;
