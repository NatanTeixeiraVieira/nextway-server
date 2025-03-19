import {
	registerDecorator,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';

export function isValidCNPJ(cnpj: string): boolean {
	const formattedCnpj = cnpj.replace(/\D/g, ''); // Remove caracteres não numéricos

	if (formattedCnpj.length !== 14 || /^(\d)\1{13}$/.test(formattedCnpj)) {
		return false; // CNPJ inválido (tamanho errado ou sequência repetida)
	}

	const calcCheckDigit = (size: number) => {
		const weights =
			size === 12
				? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
				: [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
		let sum = 0;

		for (let i = 0; i < size; i++) {
			sum += Number(formattedCnpj[i]) * weights[i];
		}

		const remainder = sum % 11;
		return remainder < 2 ? 0 : 11 - remainder;
	};

	const firstDigit = calcCheckDigit(12);
	const secondDigit = calcCheckDigit(13);

	return (
		firstDigit === Number(formattedCnpj[12]) &&
		secondDigit === Number(formattedCnpj[13])
	);
}

@ValidatorConstraint({ async: false })
export class IsCNPJConstraint implements ValidatorConstraintInterface {
	validate(cnpj: string) {
		return isValidCNPJ(cnpj);
	}

	defaultMessage() {
		return 'CNPJ inválido!';
	}
}

export function IsCNPJ(validationOptions?: ValidationOptions) {
	return (object: Object, propertyName: string) => {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [],
			validator: IsCNPJConstraint,
		});
	};
}
