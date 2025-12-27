import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { ConversationState } from './conversation-state.entity';

@Injectable()
export class ConversationStateService {
  constructor(
    @Inject(CACHE_MANAGER)
    private cache: Cache,
  ) {}

  private key(phone: string) {
    return `conversation:${phone}`;
  }

  async getState(phone: string): Promise<ConversationState> {
    return ((await this.cache.get(this.key(phone))) as ConversationState) || {};
  }

  async setState(phone: string, partial: any) {
    const current = await this.getState(phone);
    const updated = { ...current, ...partial };

    await this.cache.set(this.key(phone), updated); // 1 hora
    return updated;
  }

  async clearState(phone: string) {
    await this.cache.del(this.key(phone));
  }

  // Helpers específicos
  async setAppointmentState(phone: string, data: any) {
    return this.setState(phone, { appointmentState: data });
  }

  async getAppointmentState(phone: string) {
    const state = await this.getState(phone);
    return state.appointmentState;
  }

  async setAssistantState(phone: string, data: any) {
    return this.setState(phone, { assistantState: data });
  }

  async getAssistantState(phone: string) {
    const state = await this.getState(phone);
    return state.assistantState;
  }
}
