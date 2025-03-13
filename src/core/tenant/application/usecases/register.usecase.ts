type BannerInput = {
	active: boolean;
};

type DeliveryInput = {
	deliveryRadiusKm: number;
	deliveryPrice: number;
};

export type Input = {
	responsibleName: string;
	responsibleCpf: string;
	email: string;
	phoneNumber: string;
	zipcode: string;
};
