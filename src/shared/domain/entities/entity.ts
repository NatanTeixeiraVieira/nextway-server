type EntityProps = Record<string, unknown>;

export abstract class Entity<Props extends EntityProps> {
	private readonly _id: string;
	private readonly props: Props;

	constructor(props: Props, id?: string) {
		this.props = props;
		this._id = id ?? crypto.randomUUID().toString();
	}

	get id() {
		return this._id;
	}

	toJSON(): Props & { id: string } {
		return {
			...this.props,
			id: this._id,
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
	static with<Props extends EntityProps, Ent extends Entity<Props>>(
		this: new (
			props: Props,
			id?: string,
		) => Ent,
		entireProps: Props & { id: string },
	): Ent {
		const { id, ...props } = entireProps;
		// biome-ignore lint/complexity/noThisInStatic: Using `this` in a static method to dynamically reference the subclass constructor and create instances.
		return new this(props as unknown as Props, id);
	}
}
