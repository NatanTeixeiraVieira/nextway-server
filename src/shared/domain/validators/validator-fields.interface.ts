export type FieldsErrors = {
	[field: string]: string[];
};

export interface IValidator<PropsValidated> {
	errors: FieldsErrors | null;
	validatedData: PropsValidated | null;
	validate(data: object): boolean;
}
