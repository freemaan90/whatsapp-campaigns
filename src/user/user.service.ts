
// user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS ?? '10', 10);

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(data: Partial<User>) {
    if (!data.password) throw new Error('Password is required');
    const hashed = await bcrypt.hash(data.password, BCRYPT_ROUNDS);

    const user = this.repo.create({ ...data, password: hashed });
    return this.repo.save(user);
  }

  async findByEmail(email: string) {
    return this.repo.findOne({
      where: { email: email.toLowerCase().trim() },
      relations: ['contact', 'location'],
    });
  }

  async findByIdWithRelations(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: { contact: true, location: true },
    });
  }

  async findProfileById(id: number) {
    return this.repo.createQueryBuilder('u')
      .leftJoinAndSelect('u.contact', 'contact')
      .leftJoinAndSelect('u.location', 'location')
      .select([
        'u.id', 'u.email', 'u.phone',
        'contact.id', 'contact.name', 'contact.avatarUrl',
        'location.id', 'location.city', 'location.country',
      ])
      .where('u.id = :id', { id })
      .getOne();
  }

  async findByPhone(phone: string) {
    return this.repo.findOne({
      where: { phone: phone.trim() },
      relations: ['contact', 'location'],
    });
  }
}
