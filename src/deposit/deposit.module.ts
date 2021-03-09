import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepositRepository } from './deposit.repository';
import { DepositController } from './deposit.controller';
import { DepositService } from './deposit.service';

@Module({
  imports: [TypeOrmModule.forFeature([DepositRepository])],
  controllers: [DepositController],
  providers: [DepositService],
})
export class DepositModule {}
