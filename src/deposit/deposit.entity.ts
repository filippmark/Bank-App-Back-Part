import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Currency } from '../currency/currency.entity';
import { ClientDeposit } from '../client-deposit/client-deposit.entity';

@Entity()
export class Deposit extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  isRevocable: boolean;

  @Column('real')
  percent: number;

  @Column('integer')
  termInMs: number;

  @Column({
    type: 'bigint',
    nullable: false,
  })
  minSum: number;

  @ManyToOne(() => Currency, (currency) => currency.deposits, { eager: true })
  currency: Currency;

  @OneToMany(() => ClientDeposit, (clientDeposit) => clientDeposit.deposit)
  depositClient: ClientDeposit[];
}
