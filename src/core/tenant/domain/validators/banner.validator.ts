import {
	IsBoolean,
	IsNotEmpty,
	IsString,
	MaxLength,
	ValidatorFields,
} from '@/shared/domain/validators/validator-fields';
import { BannerProps } from '../entities/banner.entity';

export class BannerRules {
	@IsString()
	@IsNotEmpty()
	@MaxLength(255)
	imagePath: string;

	@IsBoolean()
	@IsNotEmpty()
	active: boolean;

	constructor(props: BannerProps) {
		Object.assign(this, props);
	}
}

export class BannerValidator extends ValidatorFields<BannerRules> {
	validate(data: BannerProps | null): boolean {
		return super.validate(new BannerRules(data ?? ({} as BannerProps)));
	}
}

export class BannerValidatorFactory {
	create(): BannerValidator {
		return new BannerValidator();
	}
}
