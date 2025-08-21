import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableUser1755634798564 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "user_role_enum" AS ENUM ('ADMIN', 'EMPLOYEE');
    `);

    await queryRunner.createTable(
      new Table({
        name: 'users',
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
          { name: 'name', type: 'varchar' },
          { name: 'email', type: 'varchar', isUnique: true },
          { name: 'password', type: 'varchar' },
          { name: 'phone', type: 'varchar' },
          { name: 'registration', type: 'varchar', isUnique: true },
          {
            name: 'role',
            type: 'user_role_enum',
          },
          {
            name: 'companyId',
            type: 'int',
          },
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
    await queryRunner.dropTable('users');
    await queryRunner.query(`DROP TYPE "user_role_enum"`);
  }
}
