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
  debit: string;

  @Column({
    type: 'bigint',
    nullable: true,
  })
  credit: string;

  @Column({
    type: 'bigint',
    nullable: true,
  })
  balance: string;

  @Column()
  isActiveBill: boolean;

  @ManyToOne(() => Client, (client) => client.bills, { nullable: true })
  client: Client;

  @Column({ nullable: true })
  clientId: string | null;

  @Column()
  isClosed: boolean;
}
