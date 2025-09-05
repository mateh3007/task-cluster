import { CacheInMemoryAdapter } from '@domain/adapters/cache-in-memory.adapter';
import { CacheServiceAdapter } from '@domain/adapters/cache-service.adapter';
import { Injectable, Logger } from '@nestjs/common';

export interface HierarchicalCacheConfig {
  memoryTtl?: number;
  redisTtl?: number;
  cacheKeyPrefix?: string;
}

export interface CacheInvalidationTarget {
  identifier: string | number;
  cacheKeyPrefix: string;
  description?: string;
}

export interface EntityCacheContext {
  companyId?: number;
  ownerId?: number;
  [key: string]: any;
}

@Injectable()
export class HierarchicalCacheService {
  private readonly logger = new Logger(HierarchicalCacheService.name);
  private readonly defaultConfig: Required<HierarchicalCacheConfig> = {
    memoryTtl: 5 * 60 * 1000,
    redisTtl: 15 * 60,
    cacheKeyPrefix: 'data',
  };

  constructor(
    private readonly memoryCache: CacheInMemoryAdapter<any>,
    private readonly redisCache: CacheServiceAdapter,
  ) {}

  async getOrSet<T>(
    identifier: string | number,
    fetchFunction: () => Promise<T>,
    config: HierarchicalCacheConfig = {},
  ): Promise<T> {
    const startTime = Date.now();
    const tenantId = this.getTenantId(identifier);
    const cacheKey = this.getCacheKey(identifier, config.cacheKeyPrefix);
    const finalConfig = { ...this.defaultConfig, ...config };

    // L1 Memory Cache
    const memoryCachedData = this.memoryCache.get(tenantId, cacheKey) as T;
    if (memoryCachedData && this.isValidData(memoryCachedData)) {
      this.logger.log(`🚀 L1 MEMORY HIT for ${identifier}`);
      return memoryCachedData;
    }
    this.logger.log(`❌ L1 MEMORY MISS for ${identifier}`);

    // L2 Redis Cache
    const redisCachedData = await this.redisCache.get<T>(tenantId, cacheKey);
    if (redisCachedData && this.isValidData(redisCachedData)) {
      this.memoryCache.set(
        tenantId,
        cacheKey,
        redisCachedData,
        finalConfig.memoryTtl,
      );
      this.logger.log(`🟡 L2 REDIS HIT for ${identifier} - promoted to L1`);
      return redisCachedData;
    }
    this.logger.log(`❌ L2 REDIS MISS for ${identifier}`);

    // L3 Source
    this.logger.log(
      `💾 L3 SOURCE ACCESS for ${identifier} - All cache levels missed`,
    );
    const data = await fetchFunction();

    // Cache both levels
    const redisSetPromise = this.redisCache.set(
      tenantId,
      cacheKey,
      data,
      finalConfig.redisTtl,
    );
    this.memoryCache.set(tenantId, cacheKey, data, finalConfig.memoryTtl);
    await redisSetPromise;

    const totalDuration = Date.now() - startTime;
    this.logger.log(
      `📊 L3 SOURCE COMPLETE for ${identifier} (${totalDuration}ms)`,
    );

    return data;
  }

  async invalidateEntityCaches(
    entityType: string,
    context: EntityCacheContext,
  ): Promise<void> {
    const cacheTargets = this.buildCacheTargetsForEntity(entityType, context);

    if (cacheTargets.length === 0) {
      this.logger.debug(
        `No cache targets defined for entity type: ${entityType}`,
      );
      return;
    }

    await this.invalidateRelatedCaches(
      cacheTargets,
      `${entityType} entity caches`,
    );
  }

  private async invalidateRelatedCaches(
    targets: CacheInvalidationTarget[],
    context: string,
  ): Promise<void> {
    const startTime = Date.now();

    this.logger.log(
      `🧹 INVALIDATING ${targets.length} cache targets: ${context}`,
    );

    const invalidationPromises = targets.map(async (target) => {
      try {
        await this.invalidateCache(target.identifier, target.cacheKeyPrefix);
        return { success: true, target };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        this.logger.error(
          `❌ Failed to invalidate cache: ${target.description} - ${errorMessage}`,
        );
        return { success: false, target, error: errorMessage };
      }
    });

    const results = await Promise.allSettled(invalidationPromises);
    const successful = results.filter(
      (result) => result.status === 'fulfilled' && result.value.success,
    ).length;

    const totalDuration = Date.now() - startTime;
    this.logger.log(
      `✅ Cache invalidation complete: ${successful}/${targets.length} successful (${totalDuration}ms)`,
    );
  }

  private async invalidateCache(
    identifier: string | number,
    cacheKeyPrefix?: string,
  ): Promise<void> {
    const tenantId = this.getTenantId(identifier);
    const cacheKey = this.getCacheKey(identifier, cacheKeyPrefix);

    this.memoryCache.del(tenantId, cacheKey);
    await this.redisCache.del(tenantId, cacheKey);
  }

  private buildCacheTargetsForEntity(
    entityType: string,
    context: EntityCacheContext,
  ): CacheInvalidationTarget[] {
    switch (entityType.toLowerCase()) {
      case 'task':
        return this.buildTaskCacheTargets(context);
      default:
        this.logger.warn(
          `Unknown entity type for cache invalidation: ${entityType}`,
        );
        return [];
    }
  }

  private buildTaskCacheTargets(
    context: EntityCacheContext,
  ): CacheInvalidationTarget[] {
    const targets: CacheInvalidationTarget[] = [];
    const { companyId, ownerId } = context;

    if (companyId && ownerId) {
      targets.push({
        identifier: `${companyId}-${ownerId}`,
        cacheKeyPrefix: 'tasks-by-owner',
        description: `Tasks by owner (company: ${companyId}, owner: ${ownerId})`,
      });
    }

    if (companyId) {
      targets.push({
        identifier: companyId,
        cacheKeyPrefix: 'all-tasks',
        description: `All tasks for company ${companyId}`,
      });
    }

    return targets;
  }

  private getTenantId(identifier: string | number): string {
    return identifier.toString();
  }

  private getCacheKey(identifier: string | number, prefix?: string): string {
    const cachePrefix = prefix ?? this.defaultConfig.cacheKeyPrefix;
    return `${cachePrefix}-${identifier}`;
  }

  private isValidData(data: unknown): boolean {
    if (data === null || data === undefined) {
      return false;
    }
    if (Array.isArray(data)) {
      return data.length > 0;
    }
    return true;
  }
}
