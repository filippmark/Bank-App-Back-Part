import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitizenshipRepository } from './citizenship.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CitizenshipRepository])],
  controllers: [],
  providers: [],
})
export class CitizenshipModule {}
