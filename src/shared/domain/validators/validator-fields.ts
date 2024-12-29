import { validateSync } from 'class-validator';
import { FieldsErrors, IValidator } from './validator-fields.interface';

export * from 'class-validator';

export abstract class ValidatorFields<PropsValidated extends object>
	implements IValidator<PropsValidated>
{
	errors: FieldsErrors = null;
	validatedData: PropsValidated = null;

	validate(data: PropsValidated): boolean {
		const errors = validateSync(data);

		if (errors.length) {
			this.errors = {};

			for (const error of errors) {
				const field = error.property;
				this.errors[field] = Object.values(error.constraints);
			}
			return false;
		}

		this.validatedData = data;
		return true;
	}
}
