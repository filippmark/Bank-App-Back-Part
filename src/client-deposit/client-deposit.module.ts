import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientDepositRepository } from './client-deposit.repository';
import { ClientDepositController } from './client-deposit.controller';
import { ClientDepositService } from './client-deposit.service';
import { BillService } from '../bill/bill.service';
import { BillRepository } from '../bill/bill.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientDepositRepository, BillRepository]),
  ],
  controllers: [ClientDepositController],
  providers: [ClientDepositService, BillService],
})
export class ClientDepositModule {}
