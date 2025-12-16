import { Body, Controller, Post } from '@nestjs/common';
import { RedisService } from './redis.service';


@Controller('redis')
export class RedisController {
  constructor(
    private readonly redisService: RedisService,
  ) { }
  @Post(`cache`)
  async setOnRedis(@Body() value: string) {
    await this.redisService.postCache(value)
    return await this.redisService.getCache("test")
  }
}
