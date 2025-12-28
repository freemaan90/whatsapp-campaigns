import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Contact } from '../contact/contact.entity';
import { Location } from '../location/location.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  phone: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string; // hashed

  @OneToOne(() => Contact, (contact) => contact.user, { cascade: true })
  contact: Contact;

  @OneToOne(() => Location, (location) => location.user, { cascade: true })
  location: Location;
}
