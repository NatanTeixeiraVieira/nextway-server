import { faker } from '@faker-js/faker';
import { TenantProps } from '../../entities/tenant.entity';

export function TenantDataBuilder(props?: Partial<TenantProps>): TenantProps {
	return {
		responsibleName: props?.responsibleName ?? faker.person.fullName(),
		responsibleCpf: props?.responsibleCpf ?? faker.string.numeric(11),
		email: props?.email ?? faker.internet.email(),
		responsiblePhoneNumber:
			props?.responsiblePhoneNumber ??
			faker.phone.number({ style: 'national' }),
		zipcode: props?.zipcode ?? faker.location.zipCode(),
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
		cnpj: props?.cnpj ?? faker.string.numeric(14),
		corporateReason: props?.corporateReason ?? faker.company.name(),
		establishmentName: props?.establishmentName ?? faker.company.name(),
		establishmentPhoneNumber:
			props?.establishmentPhoneNumber ??
			faker.phone.number({ style: 'national' }),
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
		verifyEmailCode: props?.verifyEmailCode ?? faker.string.alphanumeric(8),
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
				start: faker.date.soon().toISOString().substring(11, 16),
				end: faker.date.soon().toISOString().substring(11, 16),
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
