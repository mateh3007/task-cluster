import { HierarchicalCacheService } from '@application/services/cache/hierarchical-cache.service';
import { TaskEntity } from '@domain/entities/task.entity';
import { GetAllTasksParams } from '@domain/interfaces/task.interfaces';
import { ITaskRepository } from '@domain/repositories/task.repository';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class GetAllTasksByOwnerId {
  private readonly logger = new Logger(GetAllTasksByOwnerId.name);

  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly hierarchicalCache: HierarchicalCacheService,
  ) {}

  async execute(payload: GetAllTasksParams): Promise<TaskEntity[]> {
    const cacheIdentifier = this.createCacheIdentifier(payload);

    return this.hierarchicalCache.getOrSet<TaskEntity[]>(
      cacheIdentifier,
      () => this.taskRepository.findAllByCompanyAndOwnerId(payload),
      {
        cacheKeyPrefix: 'tasks-by-owner',
        memoryTtl: 5 * 60 * 1000, // 5 minutes
        redisTtl: 15 * 60, // 15 minutes
      },
    );
  }

  private createCacheIdentifier(payload: GetAllTasksParams): string {
    return `${payload.companyId}-${payload.ownerId}`;
  }
}
