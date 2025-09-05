import { HierarchicalCacheService } from '@application/services/cache/hierarchical-cache.service';
import { TaskEntity } from '@domain/entities/task.entity';
import { ITaskRepository } from '@domain/repositories/task.repository';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class GetAllTasksByCompanyId {
  private readonly logger = new Logger(GetAllTasksByCompanyId.name);

  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly hierarchicalCache: HierarchicalCacheService,
  ) {}

  async execute(companyId: number): Promise<TaskEntity[]> {
    return this.hierarchicalCache.getOrSet<TaskEntity[]>(
      companyId,
      () => this.taskRepository.findAllByCompanyId(companyId),
      {
        cacheKeyPrefix: 'all-tasks',
        memoryTtl: 5 * 60 * 1000,
        redisTtl: 15 * 60,
      },
    );
  }
}
