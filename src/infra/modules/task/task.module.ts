import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ExceptionsModule } from '../exceptions/exceptions.module';
import { CreateTaskController } from '@presentation/controllers/task/create/create-task.controller';
import { CreateTaskUseCase } from '@application/use-cases/task/create/create-task.use-case';
import { GetAllTasksController } from '@presentation/controllers/task/get-all/get-all-tasks.controller';
import { GetAllTasksByRoleUseCase } from '@application/use-cases/role/task/get-all/get-all-tasks-by-role.use-case';
import { GetAllTasksByCompanyId } from '@application/use-cases/task/get-all-by-company/get-all-tasks-by-company-id.use-case';
import { GetAllTasksByOwnerId } from '@application/use-cases/task/get-all-by-owner/get-all-tasks-by-owner-id.use-case';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [DatabaseModule, ExceptionsModule, CacheModule],
  controllers: [CreateTaskController, GetAllTasksController],
  providers: [
    CreateTaskUseCase,
    GetAllTasksByRoleUseCase,
    GetAllTasksByCompanyId,
    GetAllTasksByOwnerId,
  ],
})
export class TaskModule {}
