import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class ConversationStateService {
  private appointmentState: Record<string, any> = {};
  private assistandState: Record<string, any> = {};

  constructor(
    private readonly redisService: RedisService,
  ){}

  // --- Appointment State ---
  getAppointmentState(phone: string) {
    return this.appointmentState[phone];
  }

  setAppointmentState(phone: string, state: any) {
    this.appointmentState[phone] = state;
  }

  clearAppointmentState(phone: string) {
    delete this.appointmentState[phone];
  }

  // --- Assistant State ---
  getAssistandState(phone: string) {
    return this.assistandState[phone];
  }

  setAssistandState(phone: string, state: any) {
    this.assistandState[phone] = state;
  }

  clearAssistandState(phone: string) {
    delete this.assistandState[phone];
  }
}