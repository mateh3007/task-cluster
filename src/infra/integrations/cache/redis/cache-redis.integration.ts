import { CacheServiceAdapter } from '@domain/adapters/cache-service.adapter';
import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import Redis from 'ioredis';

export interface RedisCacheConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
  keyPrefix?: string;
  retryDelayOnFailover?: number;
  maxRetriesPerRequest?: number;
  lazyConnect?: boolean;
}

@Injectable()
export class RedisCacheIntegration
  implements CacheServiceAdapter, OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(RedisCacheIntegration.name);
  private isConnected = false;

  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async onModuleInit() {
    try {
      if (!this.redis.options.lazyConnect) {
        await this.redis.ping();
      }
      this.isConnected = true;
      this.logger.log('✅ Redis cache integration initialized');
    } catch (error) {
      this.logger.error(`❌ Redis initialization failed: ${error.message}`);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.redis.disconnect();
      this.isConnected = false;
      this.logger.log('🔌 Redis connection closed gracefully');
    } catch (error) {
      this.logger.error(`Error closing Redis connection: ${error.message}`);
    }
  }

  private getFullKey(tenantId: string, key: string): string {
    return `cache:tenant:${tenantId}:${key}`;
  }

  private validateTenantId(tenantId: string): void {
    if (!tenantId || tenantId.trim().length === 0) {
      throw new Error('TenantId is required and cannot be empty');
    }
  }

  private validateKey(key: string): void {
    if (!key || key.trim().length === 0) {
      throw new Error('Cache key is required and cannot be empty');
    }
  }

  async get<T = any>(tenantId: string, key: string): Promise<T | null> {
    try {
      this.validateTenantId(tenantId);
      this.validateKey(key);

      const fullKey = this.getFullKey(tenantId, key);
      const data = await this.redis.get(fullKey);

      if (!data) {
        this.logger.debug(`Cache MISS: ${fullKey}`);
        return null;
      }

      const parsed = JSON.parse(data) as T;
      this.logger.debug(`Cache HIT: ${fullKey}`);
      return parsed;
    } catch (error) {
      this.logger.error(
        `Redis GET error for key ${key}: ${error.message}`,
        error.stack,
      );
      return null;
    }
  }

  async set<T = any>(
    tenantId: string,
    key: string,
    value: T,
    ttl: number = 300,
  ): Promise<void> {
    try {
      this.validateTenantId(tenantId);
      this.validateKey(key);

      if (value === undefined) {
        throw new Error('Cache value cannot be undefined');
      }

      const fullKey = this.getFullKey(tenantId, key);
      const serialized = JSON.stringify(value);

      if (ttl > 0) {
        await this.redis.setex(fullKey, ttl, serialized);
      } else {
        await this.redis.set(fullKey, serialized);
      }

      this.logger.debug(`Cache SET: ${fullKey} - TTL: ${ttl}s`);
    } catch (error) {
      this.logger.error(
        `Redis SET error for key ${key}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async del(tenantId: string, key: string): Promise<void> {
    try {
      this.validateTenantId(tenantId);
      this.validateKey(key);

      const fullKey = this.getFullKey(tenantId, key);
      const deletedCount = await this.redis.del(fullKey);

      this.logger.debug(`Cache DEL: ${fullKey} - Deleted: ${deletedCount}`);
    } catch (error) {
      this.logger.error(
        `Redis DEL error for key ${key}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async delByPattern(tenantId: string, pattern: string): Promise<void> {
    try {
      this.validateTenantId(tenantId);

      const searchPattern = `cache:tenant:${tenantId}:${pattern}*`;

      const keys = await this.redis.keys(searchPattern);

      if (keys.length === 0) {
        this.logger.debug(`No keys found for pattern: ${searchPattern}`);
        return;
      }

      const batchSize = 100;
      let totalDeleted = 0;

      for (let i = 0; i < keys.length; i += batchSize) {
        const batch = keys.slice(i, i + batchSize);
        const deleted = await this.redis.del(...batch);
        totalDeleted += deleted;
      }

      this.logger.log(
        `Cache DEL BY PATTERN: ${totalDeleted} keys deleted for pattern: ${searchPattern}`,
      );
    } catch (error) {
      this.logger.error(
        `Redis DEL BY PATTERN error: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async delByPatternWithCount(
    tenantId: string,
    pattern: string,
  ): Promise<number> {
    try {
      this.validateTenantId(tenantId);

      const searchPattern = `cache:tenant:${tenantId}:${pattern}*`;
      const keys = await this.redis.keys(searchPattern);

      if (keys.length === 0) {
        this.logger.debug(`No keys found for pattern: ${searchPattern}`);
        return 0;
      }

      const batchSize = 100;
      let totalDeleted = 0;

      for (let i = 0; i < keys.length; i += batchSize) {
        const batch = keys.slice(i, i + batchSize);
        const deleted = await this.redis.del(...batch);
        totalDeleted += deleted;
      }

      this.logger.log(
        `Cache DEL BY PATTERN: ${totalDeleted} keys deleted for pattern: ${searchPattern}`,
      );
      return totalDeleted;
    } catch (error) {
      this.logger.error(
        `Redis DEL BY PATTERN error: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async clearTenantCache(tenantId: string): Promise<void> {
    this.logger.warn(`Clearing ALL cache for tenant: ${tenantId}`);
    await this.delByPattern(tenantId, '');
  }

  async clearTenantCacheWithCount(tenantId: string): Promise<number> {
    this.logger.warn(`Clearing ALL cache for tenant: ${tenantId}`);
    return await this.delByPatternWithCount(tenantId, '');
  }

  async ping(): Promise<boolean> {
    try {
      const result = await this.redis.ping();
      const isHealthy = result === 'PONG';

      if (isHealthy !== this.isConnected) {
        this.isConnected = isHealthy;
        this.logger.log(
          `Redis connection status changed: ${isHealthy ? 'CONNECTED' : 'DISCONNECTED'}`,
        );
      }

      return isHealthy;
    } catch (error) {
      this.logger.error(`Redis PING error: ${error.message}`);
      this.isConnected = false;
      return false;
    }
  }

  async exists(tenantId: string, key: string): Promise<boolean> {
    try {
      this.validateTenantId(tenantId);
      this.validateKey(key);

      const fullKey = this.getFullKey(tenantId, key);
      const exists = await this.redis.exists(fullKey);

      return exists === 1;
    } catch (error) {
      this.logger.error(`Redis EXISTS error for key ${key}: ${error.message}`);
      return false;
    }
  }

  async ttl(tenantId: string, key: string): Promise<number> {
    try {
      this.validateTenantId(tenantId);
      this.validateKey(key);

      const fullKey = this.getFullKey(tenantId, key);
      return await this.redis.ttl(fullKey);
    } catch (error) {
      this.logger.error(`Redis TTL error for key ${key}: ${error.message}`);
      return -2;
    }
  }

  async increment(
    tenantId: string,
    key: string,
    by: number = 1,
    ttl?: number,
  ): Promise<number> {
    try {
      this.validateTenantId(tenantId);
      this.validateKey(key);

      const fullKey = this.getFullKey(tenantId, key);
      const newValue = await this.redis.incrby(fullKey, by);

      if (ttl && ttl > 0) {
        await this.redis.expire(fullKey, ttl);
      }

      return newValue;
    } catch (error) {
      this.logger.error(
        `Redis INCREMENT error for key ${key}: ${error.message}`,
      );
      throw error;
    }
  }

  isHealthy(): boolean {
    return this.isConnected && this.redis.status === 'ready';
  }

  async getStats(): Promise<{
    status: string;
    isConnected: boolean;
    memory: string;
    keys: number;
  }> {
    try {
      const info = await this.redis.info('memory');
      const dbSize = await this.redis.dbsize();

      return {
        status: this.redis.status,
        isConnected: this.isConnected,
        memory: this.extractMemoryUsage(info),
        keys: dbSize,
      };
    } catch (error) {
      this.logger.error(`Error getting Redis stats: ${error.message}`);
      return {
        status: 'error',
        isConnected: false,
        memory: 'unknown',
        keys: 0,
      };
    }
  }

  private extractMemoryUsage(info: string): string {
    const match = info.match(/used_memory_human:([^\r\n]+)/);
    return match ? match[1] : 'unknown';
  }
}
