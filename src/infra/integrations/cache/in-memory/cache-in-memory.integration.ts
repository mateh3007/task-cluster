import { CacheInMemoryAdapter } from '@domain/adapters/cache-in-memory.adapter';
import { Injectable } from '@nestjs/common';
import { LRUCache } from 'lru-cache';

@Injectable()
export class MemoryCacheIntegration<T extends {}>
  implements CacheInMemoryAdapter<T>
{
  private caches: Map<string, LRUCache<string, T>> = new Map();
  private readonly defaultTtl = 60 * 1000;
  private readonly max = 500;
  constructor() {}

  private getTenantCache(tenantId: string): LRUCache<string, T> {
    if (!this.caches.has(tenantId)) {
      const options: LRUCache.Options<string, T, unknown> = {
        max: this.max,
        ttl: this.defaultTtl,
      };

      this.caches.set(tenantId, new LRUCache<string, T>(options));
    }
    return this.caches.get(tenantId)!;
  }

  get(tenantId: string, key: string): T | null {
    const cache = this.getTenantCache(tenantId);
    return cache.get(key) ?? null;
  }

  set(tenantId: string, key: string, value: T, ttl?: number) {
    const cache = this.getTenantCache(tenantId);
    cache.set(key, value, { ttl: ttl ?? this.defaultTtl });
  }

  del(tenantId: string, key: string) {
    const cache = this.getTenantCache(tenantId);
    cache.delete(key);
  }
}
