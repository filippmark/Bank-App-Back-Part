import { Module } from '@nestjs/common';
import { BillService } from './bill.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillRepository } from './bill.repository';
import { BillController } from './bill.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BillRepository])],
  providers: [BillService],
  exports: [BillService],
  controllers: [BillController],
})
export class BillModule {}
