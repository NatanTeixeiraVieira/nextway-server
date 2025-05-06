import { DomainEvent } from '../events/domain-event';

/**
 * Type representing the audit properties of an entity.
 * It includes the creation, update, and deletion (soft delete) dates.
 */
export type Audit = {
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date | null;
};

/**
 * Type representing the mandatory properties for any entity.
 * It includes the unique identifier (`id`) and the audit information.
 */
export type EntityProps = {
	id: string;
	audit: Audit;
};

/**
 * Type used for the properties passed to the constructor of an entity.
 * The `id` and audit information can be optionally provided.
 */
type ConstructorEntityProps = {
	id?: string;
	audit?: Partial<Audit>;
};

/**
 * A generic type representing the custom properties specific to each subclass.
 * This type can be extended by subclasses to define their own properties.
 */
export type BaseProps = Record<string, unknown>;

/**
 * Abstract class that serves as a base for creating entities with audit properties.
 * It manages audit properties (createdAt, updatedAt, deletedAt) and the entity's unique identifier.
 *
 * **Warning:** Subclasses that extend `Entity` should not be instantiated directly using the constructor.
 * Use the static method `with` or an appropriated method to create instances of subclasses instead.
 */
export abstract class Entity<Props extends BaseProps> {
	readonly props: Props & EntityProps;
	protected readonly events: DomainEvent[] = [];
	/**
	 * Constructor of the `Entity` class that initializes the entity's properties.
	 * If `id` is not provided, it is automatically generated.
	 * If audit information is not provided, default values for `createdAt`, `updatedAt`, and `deletedAt` are used.
	 *
	 * **Warning:** This constructor should not be called directly from subclasses. Use the `with` or an appropriated method instead.
	 *
	 * @param {Props & ConstructorEntityProps} props - The properties of the entity, including the `id` and audit information.
	 */
	constructor(props: Props & ConstructorEntityProps) {
		this.props = {
			...props,
			id: props.id ?? crypto.randomUUID().toString(),
			audit: {
				createdAt: props.audit?.createdAt ?? new Date(),
				updatedAt: props.audit?.updatedAt ?? new Date(),
				deletedAt: props.audit?.deletedAt ?? null,
			},
		};
	}

	/**
	 * Property that returns the unique identifier of the entity.
	 */
	get id() {
		return this.props.id;
	}

	/**
	 * Property that returns the audit information of the entity.
	 */
	get audit() {
		return this.props.audit;
	}

	/**
	 * Method to mark the entity as deleted by setting the `deletedAt` timestamp to the current date and time.
	 */
	protected markAsDeleted() {
		this.audit.deletedAt = new Date();
	}

	/**
	 * Method to update the updatedAt timestamp to the current date and time.
	 */
	protected updateTimestamp() {
		if (this.props.audit) {
			this.props.audit.updatedAt = new Date();
		}
	}

	/**
	 * Method to add a new domain event.
	 */
	protected addDomainEvent(domainEvent: DomainEvent) {
		this.events.push(domainEvent);
	}

	/**
	 * Clear domain events and return them.
	 */
	pullDomainEvents(): DomainEvent[] {
		const events = [...this.events];
		this.events.length = 0;
		return events;
	}

	/**
	 * Method that returns the entity's properties in a serializable format.
	 * It includes both custom properties and audit properties.
	 */
	toJSON(): Props & EntityProps {
		return {
			...this.props,
		};
	}

	/**
	 * Static method that creates instances of a subclass of `Entity` using the provided properties.
	 * This method can be used by any subclass of `Entity` to create new instances.
	 *
	 * **Warning:** This method is the recommended way to instantiate a subclass of `Entity`, or an appropriated method.
	 * Avoid using the constructor directly.
	 *
	 * @param {Props & EntityProps} props - The properties required to create the entity instance.
	 * @returns {Ent} - A new instance of the subclass, created with the provided properties.
	 *
	 * @this {new (props: Props & EntityProps) => Ent} - The constructor of the subclass that calls this method.
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
