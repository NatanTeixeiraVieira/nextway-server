import { ZipcodeAwesomeApiService } from '../../zipcode-awesomeapi.service';

describe('ZipcodeAwesomeApiService unit tests', () => {
	let sut: ZipcodeAwesomeApiService;
	let httpService: any;
	let envConfigService: any;

	beforeEach(() => {
		httpService = {
			get: jest.fn(),
		};
		envConfigService = {
			getZipcodeApiBaseUrl: jest
				.fn()
				.mockReturnValue('https://api.zipcode.com'),
		};
		sut = new ZipcodeAwesomeApiService(httpService, envConfigService);
	});

	it('should be defined', () => {
		expect(sut).toBeDefined();
	});

	it('should call httpService.get with correct url and map response', async () => {
		const zipcode = '12345678';
		const mockApiUrl = 'https://api.zipcode.com';
		const mockResponse = {
			data: {
				cep: '12345678',
				address_type: 'Rua',
				address_name: 'Rua Teste',
				address: 'Rua Teste',
				state: 'SP',
				district: 'Centro',
				lat: '-23.55052',
				lng: '-46.633308',
				city: 'São Paulo',
				city_ibge: '3550308',
				ddd: '11',
			},
		};
		httpService.get.mockResolvedValue(mockResponse);

		// Mock StateMapper.ufToStateName
		const stateName = 'São Paulo';
		jest
			.spyOn(
				require('@/shared/application/mappers/state.mapper').StateMapper,
				'ufToStateName',
			)
			.mockReturnValue(stateName);

		const result = await sut.getInfosByZipcode(zipcode);

		expect(envConfigService.getZipcodeApiBaseUrl).toHaveBeenCalledTimes(1);
		expect(httpService.get).toHaveBeenCalledWith(`${mockApiUrl}/${zipcode}`);
		expect(result).toEqual({
			city: 'São Paulo',
			uf: 'SP',
			zipcode: '12345678',
			state: stateName,
			neighborhood: 'Centro',
			street: 'Rua Teste',
			location: {
				coordinates: {
					latitude: '-23.55052',
					longitude: '-46.633308',
				},
			},
		});
	});

	it('should propagate errors from httpService.get', async () => {
		const zipcode = '12345678';
		const error = new Error('Request failed');
		httpService.get.mockRejectedValue(error);

		await expect(sut.getInfosByZipcode(zipcode)).rejects.toThrow(error);
	});
});
