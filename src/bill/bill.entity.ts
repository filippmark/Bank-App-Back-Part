import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Client } from '../client/client.entity';
@Entity()
export class Bill extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 13, unique: true })
  account: string;

  @Column({
    type: 'bigint',
    nullable: true,
  })
  debit: number;

  @Column({
    type: 'bigint',
    nullable: true,
  })
  credit: number;

  @Column({
    type: 'bigint',
    nullable: true,
  })
  balance: number;

  @Column()
  isActiveBill: boolean;

  @ManyToOne(() => Client, (client) => client.bills)
  client: Client;

  @Column()
  clientId: string;

  @Column()
  isClosed: boolean;
}