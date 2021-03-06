import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Client } from '../client/client.entity';
import { Deposit } from '../deposit/deposit.entity';
import { Bill } from '../bill/bill.entity';

@Entity()
export class ClientDeposit extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Client, (client) => client.clientDeposits, { eager: true })
  client: Client;

  @Column()
  clientId: string;

  @ManyToOne(() => Deposit, (deposit) => deposit.depositClient, { eager: true })
  deposit: Deposit;

  @Column()
  depositId: number;

  @Column()
  startDate: Date;

  @Column({
    type: 'bigint',
    nullable: true,
  })
  startSum: number;

  @Column({ default: false })
  isClosed: boolean;

  @Column()
  withCapitalization: boolean;

  @OneToOne(() => Bill, { cascade: true })
  @JoinColumn()
  mainBill: Bill;

  @OneToOne(() => Bill, { cascade: true })
  @JoinColumn()
  percentBill: Bill;
}
