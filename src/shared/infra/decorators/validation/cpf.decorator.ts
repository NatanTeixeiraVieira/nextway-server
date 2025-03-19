import {
	registerDecorator,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';

export function isValidCPF(cpf: string): boolean {
	const formattedCpf = cpf.replace(/\D/g, ''); // Remove caracteres não numéricos

	if (formattedCpf.length !== 11 || /^(\d)\1{10}$/.test(formattedCpf)) {
		return false; // CPF inválido (tamanho errado ou sequência repetida)
	}

	const calcCheckDigit = (slice: number) => {
		let sum = 0;
		for (let i = 0; i < slice; i++) {
			sum += Number(formattedCpf[i]) * (slice + 1 - i);
		}
		const remainder = (sum * 10) % 11;
		return remainder === 10 ? 0 : remainder;
	};

	const firstDigit = calcCheckDigit(9);
	const secondDigit = calcCheckDigit(10);

	return (
		firstDigit === Number(formattedCpf[9]) &&
		secondDigit === Number(formattedCpf[10])
	);
}

@ValidatorConstraint({ async: false })
export class IsCPFConstraint implements ValidatorConstraintInterface {
	validate(cpf: string) {
		return isValidCPF(cpf);
	}

	defaultMessage() {
		return 'CPF inválido!';
	}
}

export function IsCPF(validationOptions?: ValidationOptions) {
	return (object: Object, propertyName: string) => {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [],
			validator: IsCPFConstraint,
		});
	};
}
