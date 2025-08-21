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
