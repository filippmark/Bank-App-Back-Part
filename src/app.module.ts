import { Module } from '@nestjs/common';
import { typeOrmConfig } from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TownModule } from './town/town.module';
import { DisabilityModule } from './disability/disability.module';
import { CitizenshipModule } from './citizenship/citizenship.module';
import { ClientModule } from './client/client.module';
import { MaritalStatusModule } from './marital-status/marital-status.module';
import { DepositModule } from './deposit/deposit.module';
import { CurrencyModule } from './currency/currency.module';
import { ClientDepositModule } from './client-deposit/client-deposit.module';
import { BillModule } from './bill/bill.module';
import { CreditModule } from './credit/credit.module';
import { ClientCreditModule } from './client-credit/client-credit.module';

@Module({
  imports: [
    DisabilityModule,
    ClientModule,
    CitizenshipModule,
    DisabilityModule,
    TownModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    MaritalStatusModule,
    CurrencyModule,
    DepositModule,
    ClientDepositModule,
    BillModule,
    CreditModule,
    ClientCreditModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
