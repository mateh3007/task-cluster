import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableTask1755806000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "task_status_enum" AS ENUM ('PENDENT', 'IN_PROGRESS', 'COMPLETED');
    `);

    await queryRunner.createTable(
      new Table({
        name: 'tasks',
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

          { name: 'ownerId', type: 'int' },
          { name: 'companyId', type: 'int' },
          { name: 'name', type: 'varchar' },
          { name: 'description', type: 'text' },
          { name: 'expectedDurationInDays', type: 'int' },
          { name: 'durationInDays', type: 'int' },
          { name: 'status', type: 'task_status_enum' },
        ],
        foreignKeys: [
          {
            columnNames: ['companyId'],
            referencedTableName: 'companies',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['ownerId'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tasks');
    await queryRunner.query(`DROP TYPE "task_status_enum"`);
  }
}
