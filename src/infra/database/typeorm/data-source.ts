import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_MASTER || 'postgres-master',
  port: 5432,
  username: 'app_user',
  password: 'app_pass',
  database: 'app_db',
  synchronize: false,
  logging: true,
  entities: [__dirname + '/../../../modules/**/entities/*.{ts,js}'],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
});
