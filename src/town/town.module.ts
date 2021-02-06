import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TownRepository } from './town.repository';
import { TownService } from './town.service';

@Module({
  imports: [TypeOrmModule.forFeature([TownRepository])],
  controllers: [],
  providers: [TownService],
})
export class TownModule {}
