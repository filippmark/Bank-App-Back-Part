import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Deposit } from '../deposit/deposit.entity';
import { Credit } from '../credit/credit.entity';

@Entity()
export class Currency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Deposit, (deposit) => deposit.currency, { eager: false })
  deposits: Deposit[];

  @OneToMany(() => Credit, (credit) => credit.currency, { eager: false })
  credits: Credit[];
}
