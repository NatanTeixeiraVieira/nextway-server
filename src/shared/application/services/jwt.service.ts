type GenerateJwtToken = {
	token: string;
};

type Options = {
	expiresIn: string | number;
};

type Payload = Record<string, unknown>;

export interface JwtService {
	generateJwt<P extends Payload>(
		payload: P,
		secret: string,
		options: Options,
	): Promise<GenerateJwtToken>;

	verifyJwt(token: string, secret: string): Promise<boolean>;

	decodeJwt<P extends Payload>(token: string): Promise<P>;
}
