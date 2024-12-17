export type Audit = {
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date | null;
};

export type EntityProps = {
	id: string;
	audit: Audit;
};

type ConstructorEntityProps = {
	id?: string;
	audit?: Partial<Audit>;
};

type BaseProps = Record<string, unknown>;

export abstract class Entity<Props extends BaseProps> {
	private readonly props: Props & EntityProps;

	constructor(props: Props & ConstructorEntityProps) {
		this.props = {
			...props,
			id: props?.id ?? crypto.randomUUID().toString(),
			audit: {
				createdAt: props.audit?.createdAt ?? new Date(),
				updatedAt: props.audit?.updatedAt ?? new Date(),
				deletedAt: props.audit?.deletedAt ?? null,
			},
		};
	}

	get id() {
		return this.props.id;
	}

	get audit() {
		return this.props.audit;
	}

	toJSON(): Props & EntityProps {
		return {
			...this.props,
		};
	}

	/**
	 * Static method to create instances of a subclass of `Entity` from the provided properties.
	 *
	 * @param {Props} entireProps - An object containing the properties required to create the entity instance. Should contain at least the `id` property.
	 * @returns {Ent} - A new instance of the subclass, created with the provided properties.
	 *
	 * @this {new (props: Props) => Ent} - The constructor of the subclass that calls this method.
	 */
	static with<Props extends BaseProps, Ent extends Entity<Props>>(
		this: new (
			props: Props & EntityProps,
		) => Ent,
		props: Props & EntityProps,
	): Ent {
		// biome-ignore lint/complexity/noThisInStatic: Using `this` in a static method to dynamically reference the subclass constructor and create instances.
		return new this(props);
	}
}
