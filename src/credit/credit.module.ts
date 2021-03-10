import { Module } from '@nestjs/common';
import { CreditController } from './credit.controller';
import { CreditService } from './credit.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditRepository } from './credit.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CreditRepository])],
  controllers: [CreditController],
  providers: [CreditService],
})
export class CreditModule {}
