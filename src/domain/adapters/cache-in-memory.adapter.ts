export abstract class CacheInMemoryAdapter<T> {
  abstract get(tenantId: string, key: string): T | null;
  abstract set(tenantId: string, key: string, value: T, ttl?: number): void;
  abstract del(tenantId: string, key: string): void;
}
