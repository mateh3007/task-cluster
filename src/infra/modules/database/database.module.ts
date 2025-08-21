import { IAccessRepository } from '@domain/repositories/access.repository';
import { ICompanyRepository } from '@domain/repositories/company.repository';
import { IUserRepository } from '@domain/repositories/user.repository';
import { AccessRepository } from '@infra/database/typeorm/repositories/access.repository';
import { CompanyRepository } from '@infra/database/typeorm/repositories/company.repository';
import { UserRepository } from '@infra/database/typeorm/repositories/user.repository';
import { Module } from '@nestjs/common';
import { TypeOrmProviderModule } from './typeorm/typeorm.module';
import { ITaskRepository } from '@domain/repositories/task.repository';
import { TaskRepository } from '@infra/database/typeorm/repositories/task.repository';

@Module({
  imports: [TypeOrmProviderModule],
  providers: [
    {
      provide: ICompanyRepository,
      useClass: CompanyRepository,
    },
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
    {
      provide: IAccessRepository,
      useClass: AccessRepository,
    },
    {
      provide: ITaskRepository,
      useClass: TaskRepository,
    },
  ],
  exports: [
    ICompanyRepository,
    IUserRepository,
    IAccessRepository,
    ITaskRepository,
  ],
})
export class DatabaseModule {}
