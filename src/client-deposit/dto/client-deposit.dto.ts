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

  @IsNumber({
    maxDecimalPlaces: 2,
  })
  startSum: number;

  @IsBoolean()
  withCapitalization: boolean;
}
