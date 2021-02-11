import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TownRepository } from './town.repository';
import { TownService } from './town.service';
import { TownController } from './town.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TownRepository])],
  controllers: [TownController],
  providers: [TownService],
})
export class TownModule {}
