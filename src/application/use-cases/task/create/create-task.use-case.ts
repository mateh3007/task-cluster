import { ExceptionsAdapter } from '@domain/adapters/exceptions.adapter';
import { TaskEntity } from '@domain/entities/task.entity';
import { CreateTaskUseCaseParams } from '@domain/interfaces/task.interfaces';
import { IAccessRepository } from '@domain/repositories/access.repository';
import { ICompanyRepository } from '@domain/repositories/company.repository';
import { ITaskRepository } from '@domain/repositories/task.repository';
import { IUserRepository } from '@domain/repositories/user.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateTaskUseCase {
  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly userRepository: IUserRepository,
    private readonly companyRepository: ICompanyRepository,
    private readonly accessRepository: IAccessRepository,
    private readonly exceptionsAdapter: ExceptionsAdapter,
  ) {}

  async execute(payload: CreateTaskUseCaseParams): Promise<TaskEntity | void> {
    if (!payload.companyId || !payload.ownerId) {
      return this.exceptionsAdapter.badRequest({
        message: 'CompanyId and OwnerId was necessary',
      });
    }

    const userExists = await this.userRepository.findById(payload.ownerId);
    if (!userExists) {
      return this.exceptionsAdapter.badRequest({
        message: 'User Not Exists',
      });
    }

    const companyExists = await this.companyRepository.findById(
      payload.companyId,
    );
    if (!companyExists) {
      return this.exceptionsAdapter.badRequest({
        message: 'Company Not Exists',
      });
    }

    const userHasAccess = await this.accessRepository.findByUserIdAndCompanyId(
      userExists.id,
      companyExists.id,
    );
    if (!userHasAccess) {
      return this.exceptionsAdapter.unauthorized({
        message: 'User Has No Access To The Company',
      });
    }

    const task = await this.taskRepository.createTask({
      ...payload,
      ownerId: userExists.id,
      companyId: companyExists.id,
    });
    if (!task) {
      return this.exceptionsAdapter.internalServerError({
        message: 'Error To Create Task',
      });
    }

    return task;
  }
}
