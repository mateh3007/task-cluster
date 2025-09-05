import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { ITaskRepository } from '@domain/repositories/task.repository';
import { TaskEntity } from '@domain/entities/task.entity';
import {
  CreateTaskParams,
  GetAllTasksParams,
} from '@domain/interfaces/task.interfaces';

@Injectable()
export class TaskRepository implements ITaskRepository {
  private readonly repo: Repository<Task>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(Task);
  }

  async createTask(params: CreateTaskParams): Promise<TaskEntity | void> {
    const task = await this.repo.save(params);
    if (!task) return;
    return task;
  }

  async findById(id: number): Promise<TaskEntity | void> {
    const task = await this.repo.findOne({
      where: { id },
    });
    if (!task) return;
    return task;
  }

  async findByUuid(uuid: string): Promise<TaskEntity | void> {
    const task = await this.repo.findOne({
      where: { uuid },
    });
    if (!task) return;
    return task;
  }

  async findAllByOwnerId(id: number): Promise<TaskEntity[]> {
    const tasks = await this.repo.find({
      where: {
        ownerId: id,
      },
    });

    return tasks;
  }

  async findAllByCompanyId(id: number): Promise<TaskEntity[]> {
    const tasks = await this.repo.find({
      where: {
        companyId: id,
      },
    });

    return tasks;
  }

  async findAllByCompanyAndOwnerId(
    params: GetAllTasksParams,
  ): Promise<TaskEntity[]> {
    const tasks = await this.repo.find({
      where: {
        companyId: params.companyId,
        ownerId: params.ownerId,
      },
    });

    return tasks;
  }
}
