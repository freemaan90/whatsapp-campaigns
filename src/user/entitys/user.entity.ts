import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Contact } from '../../contact/contact.entity';
import { Location } from '../../location/location.entity';
import { WhatsApp } from './whatsapp.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phone: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // hashed

  @OneToOne(() => WhatsApp, (whatsapp) => whatsapp.user, { cascade: true })
  whatsapp: WhatsApp;

  @OneToOne(() => Contact, (contact) => contact.user, { cascade: true })
  contact: Contact;

  @OneToOne(() => Location, (location) => location.user, { cascade: true })
  location: Location;
}
