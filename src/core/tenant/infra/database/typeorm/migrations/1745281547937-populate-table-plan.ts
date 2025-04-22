import { MigrationInterface, QueryRunner } from 'typeorm';

export class PopulateTablePlan1745281547937 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
        INSERT INTO plan (name, price) VALUES
        ('Basic', 50)
     `);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
        DELETE FROM plan WHERE name = 'Basic' AND price = 50
    `);
	}
}
