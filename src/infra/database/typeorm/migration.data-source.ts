import 'dotenv/config';
import { DataSource } from 'typeorm';
import * as path from 'path';
import { Access } from './entities/access.entity';
import { Address } from './entities/address.entity';
import { Company } from './entities/company.entity';
import { Task } from './entities/task.entity';
import { User } from './entities/user.entity';

const dbPort = parseInt(process.env.DB_PORT || '5432', 10);
const dbUsername = process.env.DB_USERNAME || 'app_user';
const dbPassword = process.env.DB_PASSWORD || 'app_pass';
const dbName = process.env.DB_NAME || 'app_db';

const rootDir = path.resolve(__dirname, '../../../..');
const migrationsPath = path.join(
  rootDir,
  'src/infra/database/typeorm/migrations/*.{ts,js}',
);

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_MASTER_HOST || 'postgres-master',
  port: dbPort,
  username: dbUsername,
  password: dbPassword,
  database: dbName,
  synchronize: false,
  logging: true,
  entities: [Company, User, Access, Address, Task],
  migrations: [migrationsPath],
});
