import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Client } from '../client/client.entity';

@Entity()
export class Citizenship extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  name: string;

  @OneToMany(() => Client, (client) => client.citizenship)
  clients: Client[];
}
