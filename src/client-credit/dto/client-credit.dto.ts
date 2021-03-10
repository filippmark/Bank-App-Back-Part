import { IsDateString, IsNumber, IsPositive, IsUUID } from 'class-validator';

export class CreateClientCreditDto {
  @IsUUID()
  clientId: string;

  @IsPositive()
  creditId: number;

  @IsNumber({
    maxDecimalPlaces: 2,
  })
  creditSum: number;
}
