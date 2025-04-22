export class RegisterTenantDto {
	// Address
	zipcode: string;
	streetName: string;
	neighborhood: string;
	streetNumber: string;
	complement?: string;

	// Responsible infos
	responsibleName: string;
	responsibleCpf: string;
	responsiblePhoneNumber: string;

	// Establishment infos
	cnpj: string;
	establishmentName: string;
	establishmentPhoneNumber: string;
	slug: string;

	// Login infos
	email: string;
	password: string;
}
