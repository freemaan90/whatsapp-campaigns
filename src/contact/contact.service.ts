
// contact.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './contact.entity';
import { User } from '../user/user.entity';
import { ContactDto } from './dto/contact.dto';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';
import { randomUUID } from 'crypto'; // Node >=16

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private contactRepo: Repository<Contact>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  // Crea Contact asociado a userId (como definimos antes)
  async create(data: ContactDto) {
    const user = await this.userRepo.findOne({ where: { id: data.userId } });
    if (!user) throw new NotFoundException(`User ${data.userId} no encontrado`);

    const contact = this.contactRepo.create({
      company: data.company,
      website: data.website,
      addresses: data.addresses?.map(a => ({ id: randomUUID(), ...a })) ?? [],
      user,
    });

    return this.contactRepo.save(contact);
  }

  // Helper: carga contact o lanza 404
  private async loadContactOr404(contactId: number): Promise<Contact> {
    const contact = await this.contactRepo.findOne({ where: { id: contactId } });
    if (!contact) throw new NotFoundException(`Contact ${contactId} no encontrado`);
    return contact;
  }

  // Helper: busca index por addressId
  private findAddressIndex(contact: Contact, addressId: string): number {
    const list = contact.addresses ?? [];
    return list.findIndex(a => a.id === addressId);
  }

  // Agregar (append) una address con UUID
  async addAddress(contactId: number, dto: CreateAddressDto) {
    const contact = await this.loadContactOr404(contactId);

    // (Opcional) negocio: evitar duplicados por 'type'
    // if (contact.addresses?.some(a => a.type === dto.type)) {
    //   throw new ConflictException(`Ya existe una dirección con type='${dto.type}'`);
    // }

    const newAddress = { id: randomUUID(), ...dto };
    const current = Array.isArray(contact.addresses) ? contact.addresses : [];
    contact.addresses = [...current, newAddress];

    await this.contactRepo.save(contact);
    return newAddress; // devolvemos la recién creada
  }

  // Listar todas las addresses
  async listAddresses(contactId: number) {
    const contact = await this.loadContactOr404(contactId);
    return contact.addresses ?? [];
  }

  // Obtener una address específica
  async getAddress(contactId: number, addressId: string) {
    const contact = await this.loadContactOr404(contactId);
    const idx = this.findAddressIndex(contact, addressId);
    if (idx < 0) throw new NotFoundException(`Address ${addressId} no encontrada`);
    return contact.addresses![idx];
  }

  // Actualizar una address específica (merge fields)
  async updateAddress(contactId: number, addressId: string, dto: UpdateAddressDto) {
    const contact = await this.loadContactOr404(contactId);
    const idx = this.findAddressIndex(contact, addressId);
    if (idx < 0) throw new NotFoundException(`Address ${addressId} no encontrada`);

    const original = contact.addresses![idx];
    const updated = { ...original, ...dto, id: original.id }; // preservamos id
    const list = [...(contact.addresses ?? [])];
    list[idx] = updated;

    contact.addresses = list;
    await this.contactRepo.save(contact);

    return updated;
  }

  // Borrar una address específica
  async deleteAddress(contactId: number, addressId: string) {
    const contact = await this.loadContactOr404(contactId);
    const idx = this.findAddressIndex(contact, addressId);
    if (idx < 0) throw new NotFoundException(`Address ${addressId} no encontrada`);

    const list = [...(contact.addresses ?? [])];
    const [removed] = list.splice(idx, 1);
    contact.addresses = list;

    await this.contactRepo.save(contact);
    return { deleted: true, addressId: removed.id };
  }
}
