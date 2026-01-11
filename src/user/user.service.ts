// user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from './entitys/user.entity';
import * as bcrypt from 'bcrypt';
import { Contact } from 'src/contact/contact.entity';
import { WhatsApp } from './entitys/whatsapp.entity';
import { BussinesPhoneDto } from './dto/bussines-phone.dto';
import { WabaIdDto } from './dto/waba-id.dto';

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS ?? '10', 10);

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    @InjectRepository(WhatsApp) private whatsappRepo: Repository<WhatsApp>,
    private readonly dataSource: DataSource,
  ) {}

  async create(data: Partial<User>) {
    if (!data.password) throw new Error('Password is required');
    const hashed = await bcrypt.hash(data.password, BCRYPT_ROUNDS);

    return this.dataSource.transaction(async (manager) => {
      // 1) Crear usuario
      const user = manager
        .getRepository(User)
        .create({ ...data, password: hashed });
      const savedUser = await manager.getRepository(User).save(user);

      // 2) Crear contacto si no existe
      const contactRepo = manager.getRepository(Contact);
      const existingContact = await contactRepo.findOne({
        where: { user: { id: savedUser.id } },
        relations: { user: true },
      });

      if (!existingContact) {
        await contactRepo.save({
          addresses: [],
          user: savedUser,
        });
      }

      // 3) Crear WhatsApp si no existe
      const whatsappRepo = manager.getRepository(WhatsApp);
      const existingWhatsApp = await whatsappRepo.findOne({
        where: { user: { id: savedUser.id } },
        relations: { user: true },
      });

      if (!existingWhatsApp) {
        await whatsappRepo.save({
          bussines_phone: data.whatsapp?.bussines_phone, // o lo que corresponda
          waba_id: data.whatsapp?.waba_id, // o lo que corresponda
          user: savedUser,
        });
      }

      // 4) Devolver usuario con relaciones
      return manager.getRepository(User).findOne({
        where: { id: savedUser.id },
        relations: { contact: true, location: true, whatsapp: true },
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
          whatsapp: {
            id: true,
            bussines_phone: true,
            waba_id: true,
          },
        },
      });
    });
  }

  async findByEmail(email: string) {
    return this.repo.findOne({
      where: { email: email.toLowerCase().trim() },
      relations: ['contact', 'location','whatsapp'],
    });
  }

  async findByIdWithRelations(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: { contact: true, location: true, whatsapp: true },
    });
  }

  // user.service.ts
  async findProfileById(id: number) {
    const user = this.repo.findOne({
      where: { id },
      relations: { contact: true, location: true, whatsapp:true },
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
        whatsapp:{
          bussines_phone: true,
          id: true,
          waba_id: true
        }
      },
    });

    return user
  }

  async findByPhone(phone: string) {
    return this.repo.findOne({
      where: { phone: phone.trim() },
      relations: ['contact', 'location','whatsapp'],
    });
  }

  async updateBussinesPhone(whatsappId: number, body: BussinesPhoneDto) {
    const whatsapp = await this.loadWhatsAppOr404(whatsappId);
    whatsapp.bussines_phone = body.bussinesPhone;
    await this.whatsappRepo.save(whatsapp);
    return whatsapp;
  }

  async updateWabaId(whatsappId: number, body: WabaIdDto) {
    const whatsapp = await this.loadWhatsAppOr404(whatsappId);
    whatsapp.waba_id = body.wabaId;
    await this.whatsappRepo.save(whatsapp);
    return whatsapp;
  }

  // Helper: carga contact o lanza 404
  private async loadWhatsAppOr404(whatsappId: number): Promise<WhatsApp> {
    const contact = await this.whatsappRepo.findOne({
      where: { id: whatsappId },
    });
    if (!contact)
      throw new NotFoundException(`Whatsapp ${whatsappId} no encontrado`);
    return contact;
  }

  async deleteBussinesPhone(whatsappId: number) {
    await this.whatsappRepo
      .createQueryBuilder()
      .update()
      .set({ bussines_phone: () => 'NULL' })
      .where('id = :id', { id: whatsappId })
      .execute();
    return { deleted: true };
  }

  async deleteWabaId(whatsappId: number) {
    await this.whatsappRepo
      .createQueryBuilder()
      .update()
      .set({ waba_id: () => 'NULL' })
      .where('id = :id', { id: whatsappId })
      .execute();
    return { deleted: true };
  }
}
