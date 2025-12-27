import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('conversation_state')
export class ConversationState {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phone: string;

  @Column({ type: 'jsonb', nullable: true })
  appointmentState: any;

  @Column({ type: 'jsonb', nullable: true })
  assistantState: any;
}