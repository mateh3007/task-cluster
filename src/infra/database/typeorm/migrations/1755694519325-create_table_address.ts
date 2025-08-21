import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableAddress1755634798565 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'addresses',
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
          { name: 'street', type: 'varchar' },
          { name: 'number', type: 'varchar' },
          { name: 'district', type: 'varchar' },
          { name: 'city', type: 'varchar' },
          { name: 'state', type: 'varchar' },
          { name: 'zipCode', type: 'varchar' },
          { name: 'companyId', type: 'int' },
        ],
        foreignKeys: [
          {
            columnNames: ['companyId'],
            referencedTableName: 'companies',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('addresses');
  }
}
