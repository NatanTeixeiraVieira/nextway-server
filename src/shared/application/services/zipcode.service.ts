import { Ufs } from '../mappers/state.mapper';

export type ZipcodeServiceResponse = {
	zipcode: string;
	uf: Ufs;
	state: string;
	city: string;
	neighborhood: string;
	street: string;
	location: {
		coordinates: {
			longitude: string;
			latitude: string;
		};
	};
};

export interface ZipcodeService {
	getInfosByZipcode(zipcode: string): Promise<ZipcodeServiceResponse>;
}
