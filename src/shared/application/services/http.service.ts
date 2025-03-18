export type HttpServiceConfig = unknown;

export interface HttpService {
	get<Response = unknown>(
		url: string,
		config: HttpServiceConfig,
	): Promise<Response>;
}
