import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  async create(data: Partial<User>) {
      const hashed = await bcrypt.hash(data.password, 10);

    const user = this.repo.create({
      ...data,
      password: hashed
    });
    return this.repo.save(user);
  }

  async findByEmail(email:string){
        return this.repo.findOne({
      where: { email },
      relations: ['contact', 'location'],
    });
  }

  async findByPhone(phone: string) {
    return this.repo.findOne({
      where: { phone },
      relations: ['contact', 'location'],
    });
  }
}