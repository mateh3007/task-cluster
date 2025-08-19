import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialConfigV11755621217544 implements MigrationInterface {
  name = 'InitialConfigV11755621217544';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."address_addressabletype_enum" AS ENUM('COMPANY', 'USER')`,
    );
    await queryRunner.query(
      `CREATE TABLE "address" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT gen_random_uuid(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "addressableType" "public"."address_addressabletype_enum" NOT NULL, "companyId" integer NOT NULL, "country" character varying NOT NULL, "uf" character varying NOT NULL, "city" character varying NOT NULL, "zipCode" character varying NOT NULL, "street" character varying NOT NULL, "number" character varying NOT NULL, "complement" character varying, CONSTRAINT "UQ_496d4a29b0dfa82ede19a4bcad0" UNIQUE ("uuid"), CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "access" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT gen_random_uuid(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" integer NOT NULL, "companyId" integer NOT NULL, CONSTRAINT "UQ_72d3c58531c0327349c33370f0c" UNIQUE ("uuid"), CONSTRAINT "PK_e386259e6046c45ab06811584ed" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "company" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT gen_random_uuid(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "tradeName" character varying NOT NULL, "corporateName" character varying NOT NULL, "phone" character varying NOT NULL, "cnpj" character varying NOT NULL, "email" character varying NOT NULL, CONSTRAINT "UQ_3fa0b2af99d910864a56bb10c9e" UNIQUE ("uuid"), CONSTRAINT "UQ_b55d9c6e6adfa3c6de735c5a2eb" UNIQUE ("cnpj"), CONSTRAINT "UQ_b0fc567cf51b1cf717a9e8046a1" UNIQUE ("email"), CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."task_status_enum" AS ENUM('PENDENT', 'IN_PROGRESS', 'COMPLETED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "task" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT gen_random_uuid(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" integer NOT NULL, "name" character varying NOT NULL, "description" text NOT NULL, "expectedDurationInDays" integer NOT NULL, "durationInDays" integer NOT NULL, "status" "public"."task_status_enum" NOT NULL, CONSTRAINT "UQ_986727ffa05fc30a14022691831" UNIQUE ("uuid"), CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_role_enum" AS ENUM('ADMIN', 'EMPLOYEE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT gen_random_uuid(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "companyId" integer NOT NULL, "role" "public"."user_role_enum" NOT NULL, "name" character varying NOT NULL, "phone" character varying NOT NULL, "registration" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_a95e949168be7b7ece1a2382fed" UNIQUE ("uuid"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "address" ADD CONSTRAINT "FK_c3fdf52cd6b4cbbeca8f5184fb3" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "access" ADD CONSTRAINT "FK_6e34c980647d3db8ea3455046cb" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "access" ADD CONSTRAINT "FK_1ce9f8e41ed309c8bfe91df5564" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_f316d3fe53497d4d8a2957db8b9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_86586021a26d1180b0968f98502" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_86586021a26d1180b0968f98502"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" DROP CONSTRAINT "FK_f316d3fe53497d4d8a2957db8b9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "access" DROP CONSTRAINT "FK_1ce9f8e41ed309c8bfe91df5564"`,
    );
    await queryRunner.query(
      `ALTER TABLE "access" DROP CONSTRAINT "FK_6e34c980647d3db8ea3455046cb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "address" DROP CONSTRAINT "FK_c3fdf52cd6b4cbbeca8f5184fb3"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    await queryRunner.query(`DROP TABLE "task"`);
    await queryRunner.query(`DROP TYPE "public"."task_status_enum"`);
    await queryRunner.query(`DROP TABLE "company"`);
    await queryRunner.query(`DROP TABLE "access"`);
    await queryRunner.query(`DROP TABLE "address"`);
    await queryRunner.query(
      `DROP TYPE "public"."address_addressabletype_enum"`,
    );
  }
}
