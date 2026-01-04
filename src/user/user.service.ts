
// user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { Contact } from 'src/contact/contact.entity';

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS ?? '10', 10);

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private readonly dataSource: DataSource,
  ) { }

  async create(data: Partial<User>) {
    if (!data.password) throw new Error('Password is required');
    const hashed = await bcrypt.hash(data.password, BCRYPT_ROUNDS);


    return this.dataSource.transaction(async (manager) => {
      // 1) Crear y guardar el usuario
      const user = manager.getRepository(User).create({ ...data, password: hashed });
      const savedUser = await manager.getRepository(User).save(user);

      // 2) Intentar crear el contacto si no existe (idempotente)
      const contactRepo = manager.getRepository(Contact);
      const existing = await contactRepo.findOne({
        where: { user: { id: savedUser.id } },
        relations: { user: true },
      });

      if (!existing) {
        await contactRepo.save({
          addresses:[],
          user:savedUser
        });
      }

      // 3) Devolver usuario con relaciones
      return manager.getRepository(User).findOne({
        where: { id: savedUser.id },
        relations: { contact: true, location: true },
        select: {
          id: true,
          email: true,
          phone: true,
          contact: {
            id: true,
            company: true,
            website: true,
            addresses: true,
          },
          location: {
            id: true,
            city: true,
            country: true,
          },
        },
      });
    });
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


  // user.service.ts
  async findProfileById(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: { contact: true, location: true },
      select: {
        id: true,
        email: true,
        phone: true,
        contact: {
          id: true,
          company: true,
          website: true,
          addresses: true, // jsonb
        },
        location: {
          id: true,
          city: true,
          country: true,
        },
      },
    });
  }


  async findByPhone(phone: string) {
    return this.repo.findOne({
      where: { phone: phone.trim() },
      relations: ['contact', 'location'],
    });
  }
}
