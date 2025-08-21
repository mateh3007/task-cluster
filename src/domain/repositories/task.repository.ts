import { TaskEntity } from '@domain/entities/task.entity';
import { CreateTaskParams } from '@domain/interfaces/task.interfaces';

export abstract class ITaskRepository {
  abstract createTask(params: CreateTaskParams): Promise<TaskEntity | void>;
  abstract findById(id: number): Promise<TaskEntity | void>;
  abstract findByUuid(uuid: string): Promise<TaskEntity | void>;
  abstract findAllByOwnerId(id: number): Promise<TaskEntity[]>;
  abstract findAllByCompanyId(id: number): Promise<TaskEntity[]>;
}
