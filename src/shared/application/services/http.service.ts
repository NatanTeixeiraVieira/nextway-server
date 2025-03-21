export type HttpServiceConfig = unknown;

export type HttpResponse<Res = unknown> = {
	data: Res;
};

export interface HttpService {
	get<Res = unknown>(
		url: string,
		config?: HttpServiceConfig,
	): Promise<HttpResponse<Res>>;
}
