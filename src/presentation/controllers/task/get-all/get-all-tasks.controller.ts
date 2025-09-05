import { AuthenticatedRequest } from '@application/use-cases/authentication/route-authentication/route-authentication.use-case';
import { GetAllTasksByRoleUseCase } from '@application/use-cases/role/task/get-all/get-all-tasks-by-role.use-case';
import { TaskEntity } from '@domain/entities/task.entity';
import { AuthDecorator } from '@infra/common/decorators/auth/auth.decorator';
import { Controller, Req, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Task')
@Controller('task')
export class GetAllTasksController {
  constructor(
    private readonly getAllTasksByRoleUseCase: GetAllTasksByRoleUseCase,
  ) {}

  @Get()
  @AuthDecorator()
  async execute(@Req() req: AuthenticatedRequest): Promise<TaskEntity[]> {
    if (!req.user) {
      throw new Error('User not authenticated');
    }
    return await this.getAllTasksByRoleUseCase.execute(
      {
        companyId: req.user?.companyId,
        ownerId: req.user?.id,
      },
      {
        ...req.user,
      },
    );
  }
}
