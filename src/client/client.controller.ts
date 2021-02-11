import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get()
  public async getAllClients() {
    const clients = await this.clientService.getAllClients();
    return clients.map((client) => ({
      ...client,
      monthlyIncome: client.monthlyIncome / 100,
    }));
  }

  @Get(':id')
  public async getClientById(@Param('id', ParseUUIDPipe) id: string) {
    return this.clientService.getClientById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  public async createClient(@Body() createClientDto: CreateClientDto) {
    return await this.clientService.createClient(createClientDto);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  public async updateClient(
    @Param('id', ParseUUIDPipe) id,
    @Body() createClientDto: CreateClientDto,
  ) {
    return await this.clientService.updateClient(id, createClientDto);
  }

  @Delete(':id')
  public async deleteClient(@Param('id', ParseUUIDPipe) id) {
    return await this.clientService.deleteClient(id);
  }
}
