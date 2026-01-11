import { RedisService } from 'src/redis/redis.service';
import { UserService } from '../user.service';
import { Injectable, Logger } from '@nestjs/common';
import { User } from '../entitys/user.entity';
@Injectable()
export class UserResolverService {
  private readonly logger = new Logger(UserResolverService.name);

  constructor(
    private readonly userService: UserService,
    private readonly redis: RedisService,
  ) {}

  async resolveUser(waba_id: string) {
    let user;

    // 1. Intentar obtener desde cache
    try {
      user = await this.redis.getCache<User>(waba_id);
    } catch (e) {
      this.logger.error(`Redis error leyendo cache para ${waba_id}`, e);
    }

    if (user) return user;

    // 2. Buscar en DB
    const userFromDb = await this.userService.findByWabaId(waba_id);
    if (!userFromDb) {
      this.logger.warn(`No se encontró cuenta para waba_id=${waba_id}`);
      return null;
    }

    // 3. Guardar en cache
    try {
      await this.redis.postCache(waba_id, userFromDb);
    } catch (e) {
      this.logger.error(`Redis error escribiendo cache para ${waba_id}`, e);
    }

    return userFromDb;
  }
}