import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaritalStatusRepository } from './marital-status.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MaritalStatusRepository])],
  controllers: [],
  providers: [],
})
export class MaritalStatusModule {}
