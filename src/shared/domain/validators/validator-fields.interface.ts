export type FieldsErrors = {
	[field: string]: string[];
};

export interface IValidator<PropsValidated> {
	errors: FieldsErrors;
	validatedData: PropsValidated;
	validate(data: object): boolean;
}
