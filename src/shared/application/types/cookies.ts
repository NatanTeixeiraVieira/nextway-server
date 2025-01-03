export type CookiesOptions = {
	maxAge: number;
	httpOnly: boolean;
	secure: boolean;
	sameSite: string;
};

export type SetCookies = (
	name: string,
	value: string,
	options: CookiesOptions,
) => void;
