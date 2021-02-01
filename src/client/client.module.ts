import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaskRepository])],
  controllers: [ClientController],
  providers: [ClientService],
})
export class TasksModule {}
