import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmConfig } from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TownModule } from './town/town.module';
import { DisabilityModule } from './disability/disability.module';
import { CitizenshipModule } from './citizenship/citizenship.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), TownModule, DisabilityModule, CitizenshipModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
