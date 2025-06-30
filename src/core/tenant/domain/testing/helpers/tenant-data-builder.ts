import { faker } from '@faker-js/faker';
import { TenantProps } from '../../entities/tenant.entity';

function randomTimePair() {
	const startHour = faker.number.int({ min: 0, max: 22 });
	const startMinute = faker.number.int({ min: 0, max: 59 });
	const duration = faker.number.int({ min: 1, max: 120 }); // duration in minutes

	const start = new Date();
	start.setHours(startHour, startMinute, 0, 0);

	const end = new Date(start.getTime() + duration * 60000);

	const pad = (n: number) => n.toString().padStart(2, '0');
	const startStr = `${pad(start.getHours())}:${pad(start.getMinutes())}`;
	const endStr = `${pad(end.getHours())}:${pad(end.getMinutes())}`;

	return { start: startStr, end: endStr };
}

export function TenantDataBuilder(props?: Partial<TenantProps>): TenantProps {
	return {
		responsibleName: props?.responsibleName ?? faker.person.fullName(),
		responsibleCpf:
			props?.responsibleCpf ??
			['42417261006', '51996091069', '65676057076'][
				Math.floor(Math.random() * 3)
			],
		email: props?.email ?? faker.internet.email(),
		responsiblePhoneNumber:
			props?.responsiblePhoneNumber ?? faker.string.numeric(13),
		zipcode:
			props?.zipcode ?? faker.location.zipCode('########').replace('-', ''),
		state: props?.state ?? {
			id: faker.string.uuid(),
			name: faker.location.state(),
			uf: props?.state?.uf ?? 'PR',
		},
		city: props?.city ?? {
			id: faker.string.uuid(),
			name: faker.location.city(),
		},
		neighborhood: props?.neighborhood ?? faker.location.street(),
		street: props?.street ?? faker.location.street(),
		streetNumber: props?.streetNumber ?? faker.string.numeric(4),
		longitude: props?.longitude ?? faker.location.longitude(),
		latitude: props?.latitude ?? faker.location.latitude(),
		cnpj:
			props?.cnpj ??
			['58371556000174', '64885007000110', '25475162000107'][
				Math.floor(Math.random() * 3)
			],
		corporateReason: props?.corporateReason ?? faker.company.name(),
		establishmentName: props?.establishmentName ?? faker.company.name(),
		establishmentPhoneNumber:
			props?.establishmentPhoneNumber ?? faker.string.numeric(13),
		slug:
			props?.slug ?? faker.helpers.slugify(faker.company.name().toLowerCase()),
		password: props?.password ?? faker.internet.password(),
		mainColor: props?.mainColor ?? faker.color.rgb({ prefix: '#' }),
		coverImagePath: props?.coverImagePath ?? faker.image.url(),
		logoImagePath: props?.logoImagePath ?? faker.image.url(),
		description: props?.description ?? faker.lorem.sentence(),
		banners: props?.banners ?? [
			{ active: faker.datatype.boolean(), imagePath: faker.image.url() },
			{ active: faker.datatype.boolean(), imagePath: faker.image.url() },
		],
		deliveries: props?.deliveries ?? [
			{
				deliveryRadiusKm: faker.number.int({ min: 1, max: 10 }),
				deliveryPrice: faker.number.int({ min: 0, max: 50 }),
			},
			{
				deliveryRadiusKm: faker.number.int({ min: 1, max: 10 }),
				deliveryPrice: faker.number.int({ min: 0, max: 50 }),
			},
			{
				deliveryRadiusKm: faker.number.int({ min: 1, max: 10 }),
				deliveryPrice: faker.number.int({ min: 0, max: 50 }),
			},
		],
		emailVerified: props?.emailVerified ?? faker.date.anytime(),
		verifyEmailCode:
			props?.verifyEmailCode ?? faker.string.alphanumeric(6).toUpperCase(),
		forgotPasswordEmailVerificationToken:
			props?.forgotPasswordEmailVerificationToken ?? faker.string.uuid(),
		active: props?.active ?? faker.datatype.boolean(),
		payerName: props?.payerName ?? faker.person.fullName(),
		payerDocument: props?.payerDocument ?? faker.string.numeric(11),
		payerDocumentType:
			props?.payerDocumentType ?? faker.helpers.arrayElement(['CPF', 'CNPJ']),
		payerEmail: props?.payerEmail ?? faker.internet.email(),
		openingHours: props?.openingHours ?? [
			{
				weekday: {
					id: faker.string.uuid(),
					name: faker.date.weekday(),
					shortName: faker.date.weekday({ abbreviated: true }),
				},
				...randomTimePair(),
			},
		],
		plan: props?.plan ?? {
			id: faker.string.uuid(),
			name: faker.commerce.productName(),
			price: faker.number.int({ min: 0, max: 1000 }),
			externalId: faker.string.uuid(),
		},
		nextDueDate: props?.nextDueDate ?? faker.date.future(),
	};
}
