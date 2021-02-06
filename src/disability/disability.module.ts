import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DisabilityRepository } from './disability.repository';

@Module({
  imports: [TypeOrmModule.forFeature([DisabilityRepository])],
  controllers: [],
  providers: [],
})
export class DisabilityModule {}
