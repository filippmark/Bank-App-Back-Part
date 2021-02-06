import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TownRepository } from './town.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TownRepository])],
  controllers: [],
  providers: [],
})
export class TownModule {}
