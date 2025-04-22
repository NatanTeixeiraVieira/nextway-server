import {
	CreateDateColumn,
	DeleteDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

export type SchemaBaseProps = Record<string, unknown>;

export type SchemaProps = Partial<InstanceType<typeof Schema>>;

export abstract class Schema {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@CreateDateColumn({ name: 'created_at', type: 'timestamp' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
	updatedAt: Date;

	@DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
	deletedAt: Date | null;

	static with<Props extends SchemaBaseProps, Ent extends Schema>(
		this: new (
			props: Props & SchemaProps,
		) => Ent,
		props: Props & SchemaProps,
	): Ent {
		// biome-ignore lint/complexity/noThisInStatic: Using `this` in a static method to dynamically reference the subclass constructor and create instances.
		const schemaInstance = new this(props);
		Object.assign(schemaInstance, props);
		return schemaInstance;
	}
}
