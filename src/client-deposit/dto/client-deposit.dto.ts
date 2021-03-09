import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsPositive,
  IsUUID,
} from 'class-validator';

export class CreateClientDepositDto {
  @IsUUID()
  clientId: string;

  @IsPositive()
  depositId: number;

  @IsDateString()
  startDate: string;

  @IsNumber({
    maxDecimalPlaces: 2,
  })
  startSum: number;

  @IsBoolean()
  withCapitalization: boolean;
}
