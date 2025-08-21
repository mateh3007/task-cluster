import { MigrationInterface, QueryRunner, Table, TableUnique } from 'typeorm';

export class CreateTableCompany1755634798563 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'companies',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'uuid',
            type: 'uuid',
            isUnique: true,
            default: 'gen_random_uuid()',
          },
          { name: 'createdAt', type: 'timestamp', default: 'now()' },
          { name: 'updatedAt', type: 'timestamp', default: 'now()' },
          { name: 'deletedAt', type: 'timestamp', isNullable: true },
          { name: 'domain', type: 'varchar' },
          { name: 'tradeName', type: 'varchar' },
          { name: 'corporateName', type: 'varchar' },
          { name: 'phone', type: 'varchar' },
          { name: 'cnpj', type: 'varchar', isUnique: true },
          { name: 'email', type: 'varchar', isUnique: true },
        ],
      }),
      true,
    );

    await queryRunner.createUniqueConstraint(
      'companies',
      new TableUnique({
        name: 'UQ_company_domain_cnpj',
        columnNames: ['domain', 'cnpj'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('companies');
  }
}
