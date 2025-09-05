import { AuthenticatedRequest } from '@application/use-cases/authentication/route-authentication/route-authentication.use-case';
import { CreateTaskUseCase } from '@application/use-cases/task/create/create-task.use-case';
import { TaskEntity } from '@domain/entities/task.entity';
import { AuthDecorator } from '@infra/common/decorators/auth/auth.decorator';
import { Controller, Post, Body, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateTaskResponses } from '@presentation/docs/swagger/responses/task/create-task.response';
import { CreateTaskDto } from '@presentation/dtos/task/create-task.dto';

@ApiTags('Task')
@Controller('task')
export class CreateTaskController {
  constructor(private readonly createTaskUseCase: CreateTaskUseCase) {}

  @Post()
  @AuthDecorator()
  @CreateTaskResponses
  async execute(
    @Body() body: CreateTaskDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<TaskEntity | void> {
    return await this.createTaskUseCase.execute({
      ...body,
      ownerId: req.user?.id,
      companyId: req.user?.companyId,
    });
  }
}
