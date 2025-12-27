import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { NewUserDto } from './dto/new-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  async create(dto: NewUserDto) {
    const existing = await this.repo.findOne({
      where: { email: dto.email },
    });

    if (existing) {
      throw new BadRequestException('El usuario ya existe');
    }

    const user = this.repo.create(dto);
    return this.repo.save(user);
  }

  findAll() {
    return this.repo.find();
  }
}
