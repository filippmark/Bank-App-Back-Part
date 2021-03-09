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
import { Credit } from '../credit/credit.entity';
import { Bill } from '../bill/bill.entity';

@Entity()
export class ClientCredit extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Client, (client) => client.clientCredits)
  client: Client;

  @Column()
  clientId: string;

  @ManyToOne(() => Credit, (credit) => credit.creditClient)
  credit: Credit;

  @Column()
  creditId: number;

  @Column({
    type: 'bigint',
    nullable: true,
  })
  creditSum: number;

  @Column()
  isClosed: boolean;

  @Column()
  startCredit: Date;

  @OneToOne(() => Bill)
  @JoinColumn()
  mainBill: Bill;

  @OneToOne(() => Bill)
  @JoinColumn()
  percentBill: Bill;
}
