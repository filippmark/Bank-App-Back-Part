import { Module } from '@nestjs/common';
import { typeOrmConfig } from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TownModule } from './town/town.module';
import { DisabilityModule } from './disability/disability.module';
import { CitizenshipModule } from './citizenship/citizenship.module';
import { ClientModule } from './client/client.module';
import { MaritalStatusModule } from './marital-status/marital-status.module';

@Module({
  imports: [
    DisabilityModule,
    ClientModule,
    CitizenshipModule,
    DisabilityModule,
    TownModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    MaritalStatusModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
