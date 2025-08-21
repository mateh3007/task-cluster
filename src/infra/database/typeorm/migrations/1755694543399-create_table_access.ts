import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableAccess1755634798566 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'accesses',
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
          { name: 'email', type: 'varchar' },
          { name: 'password', type: 'varchar' },
          { name: 'companyId', type: 'int' },
          { name: 'userId', type: 'int' },
        ],
        foreignKeys: [
          {
            columnNames: ['companyId'],
            referencedTableName: 'companies',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['userId'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
        uniques: [
          {
            name: 'UQ_access_email_company',
            columnNames: ['email', 'companyId'],
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('accesses');
  }
}
