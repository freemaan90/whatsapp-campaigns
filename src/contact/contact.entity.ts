import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";

@Entity('contact')
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  company: string;

  @Column({ nullable: true })
  website: string;

  @OneToOne(() => User, user => user.contact)
  @JoinColumn()
  user: User;
}