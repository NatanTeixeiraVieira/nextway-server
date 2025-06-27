import { CnpjReceitawsService } from '../../cnpj-receitaws.service';

describe('CnpjReceitawsService unit tests', () => {
	let sut: CnpjReceitawsService;
	let httpService: any;
	let envConfigService: any;

	beforeEach(() => {
		httpService = {
			get: jest.fn(),
		};
		envConfigService = {
			getCnpjApiBaseUrl: jest.fn().mockReturnValue('https://api.cnpj.com'),
		};
		sut = new CnpjReceitawsService(httpService, envConfigService);
	});

	it('should call httpService.get with formatted cnpj and return corporateReason', async () => {
		const cnpj = '12.345.678/0001-90';
		const formattedCnpj = '12345678000190';
		const mockResponse = {
			data: {
				nome: 'Empresa Teste',
			},
		};
		httpService.get.mockResolvedValue(mockResponse);

		const result = await sut.getInfosByCnpj(cnpj);

		expect(envConfigService.getCnpjApiBaseUrl).toHaveBeenCalledTimes(1);
		expect(httpService.get).toHaveBeenCalledTimes(1);
		expect(httpService.get).toHaveBeenCalledWith(
			`https://api.cnpj.com/${formattedCnpj}`,
		);
		expect(result).toEqual({ corporateReason: 'Empresa Teste' });
	});
});
