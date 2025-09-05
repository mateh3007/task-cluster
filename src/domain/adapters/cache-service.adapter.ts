export abstract class CacheServiceAdapter<T = any> {
  abstract get<K = T>(tenantId: string, key: string): Promise<K | null>;
  abstract set<K = T>(
    tenantId: string,
    key: string,
    value: K,
    ttl?: number,
  ): Promise<void>;
  abstract del(tenantId: string, key: string): Promise<void>;
  abstract ping?(): Promise<boolean>;
  abstract clearTenantCache?(tenantId: string): Promise<void>;
  abstract delByPattern?(tenantId: string, pattern: string): Promise<void>;
}
