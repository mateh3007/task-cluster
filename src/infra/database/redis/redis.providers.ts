import { RedisCacheIntegration } from '@infra/integrations/cache/redis/cache-redis.integration';
import { Provider } from '@nestjs/common';
import Redis from 'ioredis';

export const RedisProviders: Provider[] = [
  {
    provide: 'REDIS_CLIENT',
    useFactory: () => {
      return new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
        db: Number(process.env.REDIS_DB) || 0,
        keyPrefix: process.env.REDIS_PREFIX || 'app:',
        lazyConnect: false,
      });
    },
  },
  {
    provide: RedisCacheIntegration,
    useFactory: (redis: Redis) => new RedisCacheIntegration(redis),
    inject: ['REDIS_CLIENT'],
  },
];
