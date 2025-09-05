import { CacheInMemoryAdapter } from '@domain/adapters/cache-in-memory.adapter';
import { CacheServiceAdapter } from '@domain/adapters/cache-service.adapter';
import { Injectable, Logger } from '@nestjs/common';

export interface HierarchicalCacheConfig {
  memoryTtl?: number;
  redisTtl?: number;
  cacheKeyPrefix?: string;
}

export interface CacheStats {
  memoryHit: boolean;
  redisHit: boolean;
  dataCount: number;
  hasData: boolean;
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

    const memoryStartTime = Date.now();
    const memoryCachedData = this.memoryCache.get(tenantId, cacheKey) as T;
    const memoryDuration = Date.now() - memoryStartTime;

    if (memoryCachedData && this.isValidData(memoryCachedData)) {
      const totalDuration = Date.now() - startTime;
      this.logger.log(
        `🚀 L1 MEMORY HIT for ${identifier}
         - Memory lookup: ${memoryDuration}ms
         - Total duration: ${totalDuration}ms
         - Data count: ${this.getDataCount(memoryCachedData)}`,
      );
      return memoryCachedData;
    }

    this.logger.debug(
      `💭 L1 MEMORY MISS for ${identifier} - Memory lookup: ${memoryDuration}ms`,
    );

    // 🟡 LEVEL 2: Redis Cache
    const redisStartTime = Date.now();
    const redisCachedData = await this.redisCache.get<T>(tenantId, cacheKey);
    const redisDuration = Date.now() - redisStartTime;

    if (redisCachedData && this.isValidData(redisCachedData)) {
      const memorySetStartTime = Date.now();
      this.memoryCache.set(
        tenantId,
        cacheKey,
        redisCachedData,
        finalConfig.memoryTtl,
      );
      const memorySetDuration = Date.now() - memorySetStartTime;

      const totalDuration = Date.now() - startTime;

      this.logger.log(
        `🟡 L2 REDIS HIT for ${identifier}
         - Memory lookup: ${memoryDuration}ms
         - Redis lookup: ${redisDuration}ms
         - Memory set: ${memorySetDuration}ms
         - Total duration: ${totalDuration}ms
         - Data count: ${this.getDataCount(redisCachedData)}
         - Promoted to L1 cache`,
      );
      return redisCachedData;
    }

    this.logger.debug(
      `🔶 L2 REDIS MISS for ${identifier} - Redis lookup: ${redisDuration}ms`,
    );

    this.logger.log(
      `💾 L3 SOURCE ACCESS for ${identifier} - All cache levels missed, fetching from source...`,
    );

    const sourceStartTime = Date.now();
    const data = await fetchFunction();
    const sourceDuration = Date.now() - sourceStartTime;

    const cacheSetStartTime = Date.now();

    const redisSetPromise = this.redisCache.set(
      tenantId,
      cacheKey,
      data,
      finalConfig.redisTtl,
    );

    this.memoryCache.set(tenantId, cacheKey, data, finalConfig.memoryTtl);

    await redisSetPromise;
    const cacheSetDuration = Date.now() - cacheSetStartTime;
    const totalDuration = Date.now() - startTime;

    this.logger.log(
      `📊 L3 SOURCE COMPLETE for ${identifier}:
       - Memory lookup: ${memoryDuration}ms
       - Redis lookup: ${redisDuration}ms
       - Source query: ${sourceDuration}ms
       - Cache storage: ${cacheSetDuration}ms
       - Total duration: ${totalDuration}ms
       - Data count: ${this.getDataCount(data)}
       - Cached: L1(${finalConfig.memoryTtl / 1000}s) + L2(${finalConfig.redisTtl}s)`,
    );

    return data;
  }

  async getFromCache<T>(
    identifier: string | number,
    cacheKeyPrefix?: string,
  ): Promise<T | null> {
    const tenantId = this.getTenantId(identifier);
    const cacheKey = this.getCacheKey(identifier, cacheKeyPrefix);

    const memoryData = this.memoryCache.get(tenantId, cacheKey) as T;
    if (memoryData && this.isValidData(memoryData)) {
      this.logger.debug(`🚀 Memory cache hit for ${identifier}`);
      return memoryData;
    }

    const redisData = await this.redisCache.get<T>(tenantId, cacheKey);
    if (redisData && this.isValidData(redisData)) {
      this.memoryCache.set(
        tenantId,
        cacheKey,
        redisData,
        this.defaultConfig.memoryTtl,
      );
      this.logger.debug(
        `🟡 Redis cache hit for ${identifier} - promoted to memory`,
      );
      return redisData;
    }

    this.logger.debug(`❌ Cache miss for ${identifier}`);
    return null;
  }

  async setInCache<T>(
    identifier: string | number,
    data: T,
    config: HierarchicalCacheConfig = {},
  ): Promise<void> {
    const tenantId = this.getTenantId(identifier);
    const cacheKey = this.getCacheKey(identifier, config.cacheKeyPrefix);
    const finalConfig = { ...this.defaultConfig, ...config };

    const startTime = Date.now();

    const redisSetPromise = this.redisCache.set(
      tenantId,
      cacheKey,
      data,
      finalConfig.redisTtl,
    );
    this.memoryCache.set(tenantId, cacheKey, data, finalConfig.memoryTtl);

    await redisSetPromise;
    const duration = Date.now() - startTime;

    this.logger.log(
      `💾 Cache SET for ${identifier}:
       - Duration: ${duration}ms
       - Data count: ${this.getDataCount(data)}
       - TTL: L1(${finalConfig.memoryTtl / 1000}s) + L2(${finalConfig.redisTtl}s)`,
    );
  }

  async invalidateCache(
    identifier: string | number,
    cacheKeyPrefix?: string,
  ): Promise<void> {
    const startTime = Date.now();
    const tenantId = this.getTenantId(identifier);
    const cacheKey = this.getCacheKey(identifier, cacheKeyPrefix);

    this.logger.log(`🧹 CACHE INVALIDATION started for ${identifier}`);

    const memoryDelStartTime = Date.now();
    this.memoryCache.del(tenantId, cacheKey);
    const memoryDelDuration = Date.now() - memoryDelStartTime;

    const redisDelStartTime = Date.now();
    await this.redisCache.del(tenantId, cacheKey);
    const redisDelDuration = Date.now() - redisDelStartTime;

    const totalDuration = Date.now() - startTime;

    this.logger.log(
      `✅ CACHE INVALIDATION completed for ${identifier}:
       - Memory clear: ${memoryDelDuration}ms
       - Redis clear: ${redisDelDuration}ms
       - Total duration: ${totalDuration}ms`,
    );
  }

  async warmupCache<T>(
    identifier: string | number,
    fetchFunction: () => Promise<T>,
    config: HierarchicalCacheConfig = {},
  ): Promise<void> {
    const startTime = Date.now();

    this.logger.log(`🔥 CACHE WARMUP started for ${identifier}`);

    const data = await this.getOrSet(identifier, fetchFunction, config);
    const totalDuration = Date.now() - startTime;

    this.logger.log(
      `🔥 CACHE WARMUP completed for ${identifier}:
       - Duration: ${totalDuration}ms
       - Data count: ${this.getDataCount(data)}`,
    );
  }

  async getCacheStats(
    identifier: string | number,
    cacheKeyPrefix?: string,
  ): Promise<CacheStats> {
    const tenantId = this.getTenantId(identifier);
    const cacheKey = this.getCacheKey(identifier, cacheKeyPrefix);

    const memoryData = this.memoryCache.get(tenantId, cacheKey);
    const redisData = await this.redisCache.get(tenantId, cacheKey);

    const hasMemoryData = !!memoryData && this.isValidData(memoryData);
    const hasRedisData = !!redisData && this.isValidData(redisData);

    return {
      memoryHit: hasMemoryData,
      redisHit: hasRedisData,
      dataCount: this.getDataCount(memoryData || redisData),
      hasData: hasMemoryData || hasRedisData,
    };
  }

  private getTenantId(identifier: string | number): string {
    return identifier.toString();
  }

  private getCacheKey(identifier: string | number, prefix?: string): string {
    const cachePrefix = prefix ?? this.defaultConfig.cacheKeyPrefix;
    return `${cachePrefix}-${identifier}`;
  }

  private getDataCount(data: any): number {
    if (data === null || data === undefined) {
      return 0;
    }
    if (Array.isArray(data)) {
      return data.length;
    }
    return 1;
  }

  private isValidData(data: any): boolean {
    if (data === null || data === undefined) {
      return false;
    }

    if (Array.isArray(data)) {
      return data.length > 0;
    }

    return true;
  }
}
