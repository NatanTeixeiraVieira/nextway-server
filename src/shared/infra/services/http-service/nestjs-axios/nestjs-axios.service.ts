import {
	HttpResponse,
	HttpService,
	HttpServiceConfig,
} from '@/shared/application/services/http.service';
import { HttpService as HttpNestjsService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export class HttpNestjsAxiosService implements HttpService {
	constructor(private readonly httpAxiosService: HttpNestjsService) {}

	async get<Res = unknown>(
		url: string,
		config?: HttpServiceConfig,
	): Promise<HttpResponse<Res>> {
		const response = await firstValueFrom(this.httpAxiosService.get<Res>(url));
		return {
			data: response.data,
		};
	}
}
