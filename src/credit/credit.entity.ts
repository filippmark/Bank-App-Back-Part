import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Currency } from '../currency/currency.entity';
import { ClientCredit } from '../client-credit/client-credit.entity';

@Entity()
export class Credit extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  isAnnuity: boolean;

  @Column('real')
  percent: number;

  @Column('integer')
  termInMs: number;

  @Column({
    type: 'bigint',
    nullable: false,
  })
  maxSum: number;

  @ManyToOne(() => Currency, (currency) => currency.credits, { eager: true })
  currency: Currency;

  @OneToMany(() => ClientCredit, (clientCredit) => clientCredit.credit)
  creditClient: ClientCredit[];
}
