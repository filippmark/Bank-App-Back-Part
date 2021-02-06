import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  MaxLength,
} from 'class-validator';
import { Column } from 'typeorm';

export class CreateTaskDto {
  name: string;

  surname: string;

  middleName: string;

  passportNumber: string;

  @IsDate()
  birthDate: Date;

  @Column()
  sex: boolean;

  passportSeries: string;

  @IsNotEmpty()
  issuer: string;

  @IsDate()
  issueDate: Date;

  passportId: string;

  @IsNotEmpty()
  @MaxLength(255)
  placeOfBirth: string;

  @IsNotEmpty()
  @MaxLength(255)
  livingAddress: string;

  @IsOptional()
  @MaxLength(255)
  mobilePhone: string;

  @IsOptional()
  @MaxLength(255)
  homePhone: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsOptional()
  @MaxLength(255)
  placeOfWork: string;

  @IsOptional()
  @MaxLength(255)
  position: string;

  @MaxLength(255)
  placeOfResidence: string;

  @IsBoolean()
  isPensioner: boolean;

  @IsBoolean()
  isLiableForMilitary: boolean;

  @IsOptional()
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  monthlyIncome: number;

  @IsPositive()
  citizenship: number;

  @IsPositive()
  disability: number;

  @IsPositive()
  regTown: number;

  @IsPositive()
  actualTown: number;
}
