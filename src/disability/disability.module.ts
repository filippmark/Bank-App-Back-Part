import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DisabilityRepository } from './disability.repository';

@Module({
  imports: [TypeOrmModule.forFeature([DisabilityRepository])],
  providers: [],
  controllers: [],
})
export class DisabilityModule {}
