export type GenerateJwtToken = {
	token: string;
};

export type JwtGenerateOptions = {
	expiresIn: string | number;
	secret: string;
};

export type JwtVerifyOptions = {
	secret: string;
};

export type Payload = Record<string, unknown>;

export interface JwtService {
	generateJwt<P extends Payload>(
		payload: P,
		options: JwtGenerateOptions,
	): Promise<GenerateJwtToken>;

	verifyJwt(token: string, options: JwtVerifyOptions): Promise<boolean>;

	decodeJwt<P extends Payload>(token: string): Promise<P>;
}
