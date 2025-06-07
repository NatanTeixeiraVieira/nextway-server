// import { CardProps } from '../entities/card.entity';

// export class CardRules {
// 	@IsString()
// 	@IsNotEmpty()
// 	tenantId: string;

// 	@IsString()
// 	@IsNotEmpty()
// 	token: string;

// 	@IsString()
// 	@IsNotEmpty()
// 	@Length(4, 4)
// 	lastDigits: string;

// 	@IsString()
// 	@IsNotEmpty()
// 	brand: string;

// 	@IsBoolean()
// 	@IsNotEmpty()
// 	active: boolean;

// 	constructor(props: CardProps) {
// 		Object.assign(this, props);
// 	}
// }

// export class CardValidator extends ValidatorFields<CardRules> {
// 	validate(data: CardProps | null): boolean {
// 		return super.validate(new CardRules(data ?? ({} as CardProps)));
// 	}
// }

// export class CardValidatorFactory {
// 	create(): CardValidator {
// 		return new CardValidator();
// 	}
// }
