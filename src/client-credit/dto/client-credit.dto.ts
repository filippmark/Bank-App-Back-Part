import { IsDateString, IsNumber, IsPositive, IsUUID } from 'class-validator';

export class CreateClientCreditDto {
  @IsUUID()
  clientId: string;

  @IsPositive()
  creditId: number;

  @IsDateString()
  startCredit: string;

  @IsNumber({
    maxDecimalPlaces: 2,
  })
  creditSum: number;
}
