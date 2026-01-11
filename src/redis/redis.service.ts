import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async postCache(phoneId: string, value: any, ttl?: number) {
    const serialized = JSON.stringify(value)
    await this.cacheManager.set(phoneId, serialized, ttl ?? 10000 * 10);
  }

  async getCache<T>(value: string): Promise<string | null> {
    const data= await this.cacheManager.get<string|null>(value);
    return data ? JSON.parse(data) : null;
  }
}
