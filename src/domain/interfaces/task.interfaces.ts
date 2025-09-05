import { TaskStatusEnum } from '@domain/enums/task-status.enum';

export interface CreateTaskParams {
  ownerId: number;
  companyId: number;
  name: string;
  description: string;
  expectedDurationInDays: number;
  durationInDays: number;
  status: TaskStatusEnum;
}

export interface CreateTaskUseCaseParams {
  ownerId?: number;
  companyId?: number;
  name: string;
  description: string;
  expectedDurationInDays: number;
  durationInDays: number;
  status: TaskStatusEnum;
}

export interface GetAllTasksParams {
  companyId: number;
  ownerId: number;
}
