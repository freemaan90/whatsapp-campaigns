import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('whatsapp')
export class WhatsApp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  bussines_phone?: string;

  @Column({ nullable: true, unique: true })
  waba_id?: string;

  @OneToOne(() => User, (user) => user.whatsapp)
  @JoinColumn() // owning side, crea FK contact.userId
  user: User;
}
