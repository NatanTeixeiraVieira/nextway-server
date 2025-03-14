type BannerInput = {
	active: boolean;
};

type DeliveryInput = {
	deliveryRadiusKm: number;
	deliveryPrice: number;
};

type OpeningHoursInput = {
	weekdayId: string;
	start: string;
	end: string;
};

export type Input = {
	responsibleName: string;
	responsibleCpf: string;
	email: string;
	phoneNumber: string;
	zipcode: string;
	neighborhood?: string;
	cnpj: string;
	establishmentName: string;
	slug: string;
	password: string;
	planId: string;
	mainColor: string;
	coverImagePath?: string;
	logoImagePath?: string;
	description: string;
	banners: BannerInput[];
	deliveries: DeliveryInput[];
	openingHours: OpeningHoursInput[];
};

// https://receitaws.com.br/v1/cnpj/{cnpj} - Search company cnpj
