import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Company } from './entities/company.entity';
import { User } from './entities/user.entity';
import { Access } from './entities/access.entity';
import { Address } from './entities/address.entity';
import { Task } from './entities/task.entity';

const dbPort = parseInt(process.env.DB_PORT || '5432', 10);
const dbUsername = process.env.DB_USERNAME || 'app_user';
const dbPassword = process.env.DB_PASSWORD || 'app_pass';
const dbName = process.env.DB_NAME || 'app_db';

export const AppDataSource = new DataSource({
  type: 'postgres',
  replication: {
    master: {
      host: process.env.DB_MASTER_HOST || 'postgres-master',
      port: dbPort,
      username: dbUsername,
      password: dbPassword,
      database: dbName,
    },
    slaves: [
      {
        host: process.env.DB_REPLICA_1_HOST || 'postgres-replica-1',
        port: dbPort,
        username: dbUsername,
        password: dbPassword,
        database: dbName,
      },
      {
        host: process.env.DB_REPLICA_2_HOST || 'postgres-replica-2',
        port: dbPort,
        username: dbUsername,
        password: dbPassword,
        database: dbName,
      },
      {
        host: process.env.DB_REPLICA_3_HOST || 'postgres-replica-3',
        port: dbPort,
        username: dbUsername,
        password: dbPassword,
        database: dbName,
      },
    ],
  },
  synchronize: false,
  entities: [Company, User, Access, Address, Task],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
});
