type BannerInput = {
	active: boolean;
};

type DeliveryInput = {
	deliveryRadiusKm: number;
	deliveryPrice: number;
};

export type Input = {
	responsibleName: string;
	email: string;
	password: string;
	slug: string;
	phoneNumber: string;
	// state: string;
	// uf: string;
	// city: string;
	neighborhood: string;
	// street: string;
	streetNumber: string;
	zipcode: string;
	mainColor: string;
	banners: BannerInput[];
	establishmentName: string;
	// longitude: number;
	// latitude: number;
	deliveryProps: DeliveryInput[];
};
