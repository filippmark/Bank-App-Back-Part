import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaritalStatusRepository } from './marital-status.repository';
import { MaritalStatusService } from './marital-status.service';
import { MaritalStatusController } from './marital-status.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MaritalStatusRepository])],
  controllers: [MaritalStatusController],
  providers: [MaritalStatusService],
})
export class MaritalStatusModule {}
