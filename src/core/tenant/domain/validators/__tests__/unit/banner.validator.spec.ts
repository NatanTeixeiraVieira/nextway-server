import { BannerProps } from '../../../entities/banner.entity';
import {
	BannerRules,
	BannerValidator,
	BannerValidatorFactory,
} from '../../banner.validator';

let sut: BannerValidator;
let props: BannerProps;

describe('BannerValidator unit tests', () => {
	beforeEach(() => {
		const bannerValidatorFactory = new BannerValidatorFactory();
		sut = bannerValidatorFactory.create();
		props = {
			imagePath: '/images/banner1.png',
			active: true,
		};
	});

	it('should test invalidation cases for imagePath field', () => {
		let isValid = sut.validate(null as any);
		expect(isValid).toBeFalsy();
		expect(sut.errors?.['imagePath']).toStrictEqual([
			'imagePath must be shorter than or equal to 255 characters',
			'imagePath should not be empty',
			'imagePath must be a string',
		]);

		isValid = sut.validate({ ...props, imagePath: '' });
		expect(isValid).toBeFalsy();
		expect(sut.errors?.['imagePath']).toStrictEqual([
			'imagePath should not be empty',
		]);

		isValid = sut.validate({ ...props, imagePath: 123 as any });
		expect(isValid).toBeFalsy();
		expect(sut.errors?.['imagePath']).toStrictEqual([
			'imagePath must be shorter than or equal to 255 characters',
			'imagePath must be a string',
		]);

		isValid = sut.validate({ ...props, imagePath: 'a'.repeat(256) });
		expect(isValid).toBeFalsy();
		expect(sut.errors?.['imagePath']).toStrictEqual([
			'imagePath must be shorter than or equal to 255 characters',
		]);
	});

	it('should test invalidation cases for active field', () => {
		let isValid = sut.validate(null as any);
		expect(isValid).toBeFalsy();
		expect(sut.errors?.['active']).toStrictEqual([
			'active should not be empty',
			'active must be a boolean value',
		]);

		isValid = sut.validate({ ...props, active: null as any });
		expect(isValid).toBeFalsy();
		expect(sut.errors?.['active']).toStrictEqual([
			'active should not be empty',
			'active must be a boolean value',
		]);

		isValid = sut.validate({ ...props, active: 'true' as any });
		expect(isValid).toBeFalsy();
		expect(sut.errors?.['active']).toStrictEqual([
			'active must be a boolean value',
		]);
	});

	it('should test valid cases for banner rules', () => {
		const isValid = sut.validate(props);
		expect(isValid).toBeTruthy();
		expect(sut.validatedData).toStrictEqual(new BannerRules(props));
	});
});
