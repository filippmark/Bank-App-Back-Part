import { Module } from '@nestjs/common';
import { ClientCreditController } from './client-credit.controller';
import { ClientCreditService } from './client-credit.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientCreditRepository } from './client-credit.repository';
import { BillRepository } from '../bill/bill.repository';
import { BillService } from '../bill/bill.service';

@Module({
  imports: [TypeOrmModule.forFeature([ClientCreditRepository, BillRepository])],
  controllers: [ClientCreditController],
  providers: [ClientCreditService, BillService],
})
export class ClientCreditModule {}
