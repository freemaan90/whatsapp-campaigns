import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './appointment.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private repo: Repository<Appointment>,
  ) {}

  async create(data: Partial<Appointment>) {
    const appointment = this.repo.create(data);
    return this.repo.save(appointment);
  }

  async isAvailable(date: string, time: string): Promise<boolean> {
    const existing = await this.repo.findOne({
      where: { date, time },
    });
    return !existing;
  }
}
