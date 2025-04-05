export class RegisterTenantDto {
	zipcode: string;
	streetNumber: string;

	responsibleName: string;
	responsibleCpf: string;
	responsiblePhoneNumber: string;
	neighborhood?: string;

	cnpj: string;
	establishmentName: string;
	establishmentPhoneNumber: string;

	planId: string;

	email: string;
	password: string;

	openingHours: OpeningHoursDto[];
	slug: string;
	mainColor: string;
	description: string;
	deliveries: DeliveryDto[];
}

class OpeningHoursDto {
	weekdayId: string;
	start: string;
	end: string;
}

class DeliveryDto {
	deliveryRadiusKm: number;
	deliveryPrice: number;
}
