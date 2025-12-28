import { Controller, Post, Body } from '@nestjs/common';
import { LocationService } from './location.service';

@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  async createLocation(@Body() body: any) {
    return this.locationService.create(body);
  }
}