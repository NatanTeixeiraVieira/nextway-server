export type HttpServiceConfig = unknown;

type Response<Res = unknown> = {
	data: Res;
};

export interface HttpService {
	get<Res = unknown>(
		url: string,
		config?: HttpServiceConfig,
	): Promise<Response<Res>>;
}
