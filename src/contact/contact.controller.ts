
// contact.controller.ts
import { Controller, Post, Body, Param, Get, Patch, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';
import { ContactDto } from './dto/contact.dto'; // tu DTO para crear Contact
import { AuthGuard } from '@nestjs/passport';
import { UpdateWebsiteDto } from './dto/website.dto';
import { UpdateCompanyDto } from './dto/company.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  // Crear Contact (como ya lo tenías)
  @Post()
  async createContact(@Body() body: ContactDto) {
    return this.contactService.create(body);
  }

  // --- CRID de Website and Company
  
  // Agregar Website and Company

  @Patch(':id/website')
  updateWebsite(@Param('id') id: number, @Body() dto: UpdateWebsiteDto) {
    return this.contactService.updateWebsite(id, dto);
  }

  
  @Patch(':id/company')
  updateCompany(@Param('id') id: number, @Body() dto: UpdateCompanyDto) {
    return this.contactService.updateCompany(id, dto);
  }

  @Delete(':id/company')
  deleteCompany(@Param('id') id: number){
    return this.contactService.deleteCompany(id)
  }

  @Delete(':id/website')
  deleteWebsite(@Param('id') id: number){
    return this.contactService.deleteWebsite(id)
  }

  // --- CRUD de addresses (JSON en Contact) ---

  // Agregar una dirección (append)
  @Post(':id/addresses')
  async addAddress(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateAddressDto,
  ) {
    return this.contactService.addAddress(id, body);
  }

  // Listar todas las direcciones
  @Get(':id/addresses')
  async listAddresses(@Param('id', ParseIntPipe) id: number) {
    return this.contactService.listAddresses(id);
  }

  // Obtener una dirección específica por addressId
  @Get(':id/addresses/:addressId')
  async getAddress(
    @Param('id', ParseIntPipe) id: number,
    @Param('addressId') addressId: string,
  ) {
    return this.contactService.getAddress(id, addressId);
  }

  // Actualizar una dirección específica
  @Patch(':id/addresses/:addressId')
  async updateAddress(
    @Param('id', ParseIntPipe) id: number,
    @Param('addressId') addressId: string,
    @Body() body: UpdateAddressDto,
  ) {
    return this.contactService.updateAddress(id, addressId, body);
  }

  // Borrar una dirección
  @Delete(':id/addresses/:addressId')
  async deleteAddress(
    @Param('id', ParseIntPipe) id: number,
    @Param('addressId') addressId: string,
  ) {
    return this.contactService.deleteAddress(id, addressId);
  }
}
