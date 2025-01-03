export function mockTransactionTest() {
	return {
		Transactional: jest.fn(
			() =>
				(
					_target: unknown,
					_propertyKey: string,
					descriptor: PropertyDescriptor,
				) =>
					descriptor,
		),
	};
}
