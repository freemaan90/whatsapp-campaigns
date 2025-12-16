import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { AppService } from './app.service';
import type { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post(`cache`)
  async setOnRedis(@Body() value:string){
    await this.cacheManager.set(`test`,value,1000*10)
    return await this.cacheManager.get('test')
  }
}
