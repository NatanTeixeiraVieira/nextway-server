import { MigrationInterface, QueryRunner } from 'typeorm';

export class PopulateTableState1746136554113 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      INSERT INTO state (id, name, uf) VALUES
        (1, 'Acre', 'AC'),
        (2, 'Alagoas', 'AL'),
        (3, 'Amazonas', 'AM'),
        (4, 'Amapá', 'AP'),
        (5, 'Bahia', 'BA'),
        (6, 'Ceará', 'CE'),
        (7, 'Distrito Federal', 'DF'),
        (8, 'Espírito Santo', 'ES'),
        (9, 'Goiás', 'GO'),
        (10, 'Maranhão', 'MA'),
        (11, 'Minas Gerais', 'MG'),
        (12, 'Mato Grosso do Sul', 'MS'),
        (13, 'Mato Grosso', 'MT'),
        (14, 'Pará', 'PA'),
        (15, 'Paraíba', 'PB'),
        (16, 'Pernambuco', 'PE'),
        (17, 'Piauí', 'PI'),
        (18, 'Paraná', 'PR'),
        (19, 'Rio de Janeiro', 'RJ'),
        (20, 'Rio Grande do Norte', 'RN'),
        (21, 'Rondônia', 'RO'),
        (22, 'Roraima', 'RR'),
        (23, 'Rio Grande do Sul', 'RS'),
        (24, 'Santa Catarina', 'SC'),
        (25, 'Sergipe', 'SE'),
        (26, 'São Paulo', 'SP'),
        (27, 'Tocantins', 'TO')
    `);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      DELETE FROM state
      WHERE id IN (
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
        11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27
      );
    `);
	}
}
