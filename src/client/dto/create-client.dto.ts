import {
  IsAlpha,
  IsAlphanumeric,
  IsBoolean,
  IsDateString,
  IsEmail, IsMobilePhone,
  IsNotEmpty,
  IsNumber, IsNumberString,
  IsOptional,
  IsPassportNumber,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { Column } from 'typeorm';

const ONLY_RU_ALPHABET_ERROR = 'Только буквы русского афавита';

export class CreateClientDto {
  @IsOptional()
  @IsUUID()
  id: string;

  @IsAlpha('ru-RU', { message: ONLY_RU_ALPHABET_ERROR })
  name: string;

  @IsAlpha('ru-RU', { message: ONLY_RU_ALPHABET_ERROR })
  surname: string;

  @IsAlpha('ru-RU', { message: ONLY_RU_ALPHABET_ERROR })
  middleName: string;

  @IsAlphanumeric()
  passportNumber: string;

  @IsDateString()
  birthDate: string;

  @Column()
  sex: boolean;

  @IsPassportNumber('BY')
  passportSeries: string;

  @IsNotEmpty()
  issuer: string;

  @IsDateString()
  issueDate: string;

  @IsAlphanumeric()
  passportId: string;

  @IsNotEmpty()
  placeOfBirth: string;

  @IsNotEmpty()
  livingAddress: string;

  @IsOptional()
  @IsMobilePhone('be-BY')
  mobilePhone: string;

  @IsOptional()
  @IsNumberString()
  homePhone: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  placeOfWork: string;

  @IsOptional()
  @IsString()
  position: string;

  @IsString()
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
  citizenshipId: number;

  @IsPositive()
  disabilityId: number;

  @IsPositive()
  regTownId: number;

  @IsPositive()
  actualTownId: number;

  @IsPositive()
  maritalStatusId: number;
}
