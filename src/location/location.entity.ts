import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/entitys/user.entity";

@Entity('location')
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  street: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  zip: string;

  @Column({ nullable: true })
  country: string;

  @Column({ type: 'float', nullable: true })
  latitude: number;

  @Column({ type: 'float', nullable: true })
  longitude: number;

  @OneToOne(() => User, user => user.location)
  @JoinColumn()
  user: User;
}