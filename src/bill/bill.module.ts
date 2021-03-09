import { Module } from '@nestjs/common';
import { BillService } from './bill.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillRepository } from './bill.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BillRepository])],
  providers: [BillService],
  exports: [BillService],
})
export class BillModule {}
