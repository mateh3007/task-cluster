import { ExceptionsAdapter } from '@domain/adapters/exceptions.adapter';
import { RoleEnum } from '@domain/enums/role.enum';
import { Injectable } from '@nestjs/common';
import { RoleHandlerUseCase } from '../../handler/handler-role.use-case';
import { UserEntity } from '@domain/entities/user.entity';
import { TaskEntity } from '@domain/entities/task.entity';
import { GetAllTasksByCompanyId } from '@application/use-cases/task/get-all-by-company/get-all-tasks-by-company-id.use-case';
import { GetAllTasksByOwnerId } from '@application/use-cases/task/get-all-by-owner/get-all-tasks-by-owner-id.use-case';
import { GetAllTasksParams } from '@domain/interfaces/task.interfaces';

@Injectable()
export class GetAllTasksByRoleUseCase extends RoleHandlerUseCase {
  constructor(
    private readonly getAllTasksByCompanyIdUseCase: GetAllTasksByCompanyId,
    private readonly getAllTasksByOwnerIdUseCase: GetAllTasksByOwnerId,
    exceptionsService: ExceptionsAdapter,
  ) {
    super(exceptionsService);
  }

  async execute(
    params: GetAllTasksParams,
    user: UserEntity,
  ): Promise<TaskEntity[]> {
    return this.handler(
      {
        [RoleEnum.ADMIN]: () =>
          this.getAllTasksByCompanyIdUseCase.execute(params.companyId),
        [RoleEnum.EMPLOYEE]: () =>
          this.getAllTasksByOwnerIdUseCase.execute({
            companyId: params.companyId,
            ownerId: params.ownerId,
          }),
      },
      user,
    );
  }
}
