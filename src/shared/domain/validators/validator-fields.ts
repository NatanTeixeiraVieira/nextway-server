import { validateSync } from 'class-validator';
import { FieldsErrors, IValidator } from './validator-fields.interface';

export { IsCPF } from '@/shared/infra/decorators/validation/cpf.decorator';
export * from 'class-validator';

export abstract class ValidatorFields<PropsValidated extends object>
	implements IValidator<PropsValidated>
{
	errors: FieldsErrors | null = null;
	validatedData: PropsValidated | null = null;

	validate(data: PropsValidated): boolean {
		const errors = validateSync(data);

		if (errors.length) {
			this.errors = {};

			for (const error of errors) {
				const field = error.property;
				this.errors[field] = Object.values(error.constraints ?? {});
			}
			return false;
		}

		this.validatedData = data;
		return true;
	}

	protected flattenErrors(
		prefix: string,
		errors: Record<string, string[]>,
	): void {
		const result: Record<string, string[]> = {};
		for (const key in errors) {
			result[`${prefix}.${key}`] = errors[key];
		}

		this.errors = {
			...this.errors,
			...result,
		};
	}
}
