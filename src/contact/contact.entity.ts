
// contact.entity.ts
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/entitys/user.entity';

export interface AddressItem {
  id: string;              // UUID
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;         // default "Argentina" si querés
  country_code: string;    // default "AR" si querés
  type: string;            // 'home' | 'work' | etc.
}

@Entity('contact')
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  company?: string;

  @Column({ nullable: true })
  website?: string;

  // PostgreSQL: 'jsonb'; MySQL/MariaDB: 'json'
  @Column({ type: 'jsonb', nullable: true })
  addresses?: AddressItem[];

  @OneToOne(() => User, (user) => user.contact)
  @JoinColumn() // owning side, crea FK contact.userId
  user: User;
}
