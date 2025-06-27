import { HttpNestjsAxiosService } from '../../nestjs-axios.service';

describe('HttpNestjsAxiosService unit tests', () => {
	let sut: HttpNestjsAxiosService;
	let httpAxiosService: any;

	beforeEach(() => {
		httpAxiosService = {
			get: jest.fn(),
		};
		sut = new HttpNestjsAxiosService(httpAxiosService);
	});

	it('should call httpAxiosService.get and return data', async () => {
		const url = 'https://api.test.com/data';
		const mockData = { foo: 'bar' };
		const mockObservable = {
			toPromise: () => Promise.resolve({ data: mockData }),
			subscribe: jest.fn(),
		};
		// Simulate RxJS observable with a resolved value
		httpAxiosService.get.mockReturnValue({
			toPromise: () => Promise.resolve({ data: mockData }),
			subscribe: jest.fn(),
		});
		// Patch firstValueFrom to use toPromise for this test
		jest
			.spyOn(require('rxjs'), 'firstValueFrom')
			.mockImplementation((obs: any) => obs.toPromise());

		const result = await sut.get(url);

		expect(httpAxiosService.get).toHaveBeenCalledTimes(1);
		expect(httpAxiosService.get).toHaveBeenCalledWith(url);
		expect(result).toStrictEqual({ data: mockData });
	});

	it('should propagate errors from httpAxiosService.get', async () => {
		const url = 'https://api.test.com/data';
		const error = new Error('Request failed');
		httpAxiosService.get.mockReturnValue({
			toPromise: () => Promise.reject(error),
			subscribe: jest.fn(),
		});
		jest
			.spyOn(require('rxjs'), 'firstValueFrom')
			.mockImplementation((obs: any) => obs.toPromise());

		await expect(sut.get(url)).rejects.toThrow(error);
	});
});
