import { HierarchicalCacheService } from '@application/services/cache/hierarchical-cache.service';
import { CacheInMemoryAdapter } from '@domain/adapters/cache-in-memory.adapter';
import { CacheServiceAdapter } from '@domain/adapters/cache-service.adapter';
import { RedisProviders } from '@infra/database/redis/redis.providers';
import { MemoryCacheIntegration } from '@infra/integrations/cache/in-memory/cache-in-memory.integration';
import { RedisCacheIntegration } from '@infra/integrations/cache/redis/cache-redis.integration';
import { Module } from '@nestjs/common';

@Module({
  providers: [
    ...RedisProviders,
    {
      provide: CacheInMemoryAdapter,
      useClass: MemoryCacheIntegration,
    },
    {
      provide: CacheServiceAdapter,
      useClass: RedisCacheIntegration,
    },
    HierarchicalCacheService,
  ],
  exports: [
    HierarchicalCacheService,
    CacheInMemoryAdapter,
    CacheServiceAdapter,
  ],
})
export class CacheModule {}
