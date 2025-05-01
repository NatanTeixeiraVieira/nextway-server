import { MigrationInterface, QueryRunner } from 'typeorm';

export class PopulateTablePlan1746136570316 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      INSERT INTO plan (name, price, external_id) VALUES
      ('Basic', 50, '2c938084966db7d60196750f5fd60361')
    `);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      DELETE FROM plan WHERE external_id = '2c938084966db7d60196750f5fd60361'
    `);
	}
}
