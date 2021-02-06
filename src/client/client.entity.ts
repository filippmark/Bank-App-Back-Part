import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Citizenship } from '../citizenship/citizenship.entity';
import { Disability } from '../disability/disability.entity';
import { Town } from '../town/town.entity';

@Entity()
export class Client extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  middleName: string;

  @Column()
  passportNumber: string;

  @Column()
  birthDate: Date;

  @Column()
  sex: boolean;

  @Column({
    unique: true,
  })
  passportSeries: string;

  @Column()
  issuer: string;

  @Column()
  issueDate: Date;

  @Column({
    unique: true,
  })
  passportId: string;

  @Column()
  placeOfBirth: string;

  @Column()
  livingAddress: string;

  @Column({
    nullable: true,
  })
  mobilePhone: string;

  @Column({
    nullable: true,
  })
  homePhone: string;

  @Column({
    nullable: true,
  })
  email: string;

  @Column({
    nullable: true,
  })
  placeOfWork: string;

  @Column({
    nullable: true,
  })
  position: string;

  @Column()
  placeOfResidence: string;

  @Column()
  isPensioner: boolean;

  @Column()
  isLiableForMilitary: boolean;

  @Column({
    type: 'bigint',
    nullable: true,
  })
  monthlyIncome: number;

  @ManyToOne(() => Citizenship, (citizenship) => citizenship.clients, {
    nullable: false,
  })
  citizenship: Citizenship;

  @Column()
  citizenshipId: number;

  @ManyToOne(() => Disability, (disability) => disability.clients)
  disability: Disability;

  @Column()
  disabilityId: number;

  @ManyToOne(() => Town, (town) => town.clients, { nullable: false })
  regTown: Town;

  @Column()
  regTownId: number;

  @ManyToOne(() => Town, (town) => town.clients, { nullable: false })
  actualTown: Town;

  @Column()
  actualTownId: number;
}
