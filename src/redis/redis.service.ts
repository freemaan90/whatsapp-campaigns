import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
@Injectable()
export class RedisService {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }

    async postCache(value: string,phoneId:string) {
        await this.cacheManager.set(phoneId, value, 10000 * 10)
    }

    async getCache(value: string) {
        return this.cacheManager.get(value)
    }

}
