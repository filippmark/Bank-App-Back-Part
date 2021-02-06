import { Controller, Get, Post } from '@nestjs/common';
import { ClientService } from './client.service';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get(':id')
  public getClientById() {
    return 'Client controller';
  }

  @Post()
  public createClient() {
    this.clientService.createClient();
    return 'test';
  }
}
