import { EnvConfig } from '@/shared/application/env-config/env-config';
import { HttpService } from '@/shared/application/services/http.service';
import {
	ZipcodeService,
	ZipcodeServiceResponse,
} from '@/shared/application/services/zipcode.service';

type ZipcodeResponse = {
	cep: string;
	state: string;
	city: string;
	neighborhood: string;
	street: string;
	service: string;
	location: {
		type: string;
		coordinates: {
			longitude?: string;
			latitude?: string;
		};
	};
};

export class ZipcodeBrasilApiService implements ZipcodeService {
	constructor(
		private readonly httpService: HttpService,
		private readonly envCofigService: EnvConfig,
	) {}

	async getInfosByZipcode(zipcode: string): Promise<ZipcodeServiceResponse> {
		const apiUrl = this.envCofigService.getZipcodeApiBaseUrl();
		const response = await this.httpService.get<ZipcodeResponse>(
			`${apiUrl}/${zipcode}`,
		);

		const { cep, state, ...res } = response.data;
		return {
			...res,
			uf: state,
			zipcode: cep,
		};
	}
}
