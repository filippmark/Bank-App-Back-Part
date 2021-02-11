import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitizenshipRepository } from './citizenship.repository';
import { CitizenshipController } from './citizenship.controller';
import { CitizenshipService } from './citizenship.service';

@Module({
  imports: [TypeOrmModule.forFeature([CitizenshipRepository])],
  controllers: [CitizenshipController],
  providers: [CitizenshipService],
})
export class CitizenshipModule {}
