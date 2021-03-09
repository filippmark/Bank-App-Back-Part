import { Module } from '@nestjs/common';
import { CurrencyController } from './currency.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyRepository } from './currency.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CurrencyRepository])],
  controllers: [CurrencyController],
})
export class CurrencyModule {}
