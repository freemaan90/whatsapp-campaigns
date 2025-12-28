import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './location.entity';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private repo: Repository<Location>,
  ) {}

  async create(data: Partial<Location>) {
    const location = this.repo.create(data);
    return this.repo.save(location);
  }
}