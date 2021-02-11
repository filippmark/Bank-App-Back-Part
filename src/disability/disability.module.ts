import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DisabilityRepository } from './disability.repository';
import { DisabilityService } from './disability.service';
import { DisabilityController } from './disability.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DisabilityRepository])],
  controllers: [DisabilityController],
  providers: [DisabilityService],
})
export class DisabilityModule {}
