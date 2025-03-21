import { EnvConfig } from '@/shared/application/env-config/env-config';
import { StateMapper, Ufs } from '@/shared/application/mappers/state.mapper';
import { HttpService } from '@/shared/application/services/http.service';
import {
	ZipcodeService,
	ZipcodeServiceResponse,
} from '@/shared/application/services/zipcode.service';

type ZipcodeResponse = {
	cep: string;
	address_type: string;
	address_name: string;
	address: string;
	state: Ufs;
	district: string;
	lat: string;
	lng: string;
	city: string;
	city_ibge: string;
	ddd: string;
};

export class ZipcodeAwesomeApiService implements ZipcodeService {
	constructor(
		private readonly httpService: HttpService,
		private readonly envCofigService: EnvConfig,
	) {}

	async getInfosByZipcode(zipcode: string): Promise<ZipcodeServiceResponse> {
		const apiUrl = this.envCofigService.getZipcodeApiBaseUrl();
		const response = await this.httpService.get<ZipcodeResponse>(
			`${apiUrl}/${zipcode}`,
		);

		const { cep, state: uf, district, lat, address, lng, city } = response.data;
		const state = StateMapper.ufToStateName(uf);
		return {
			city,
			uf,
			zipcode: cep,
			state,
			neighborhood: district,
			street: address,
			location: {
				coordinates: {
					latitude: lat,
					longitude: lng,
				},
			},
		};
	}
}
