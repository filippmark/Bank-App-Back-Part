import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { ClientRepository } from './client.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ClientRepository])],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
