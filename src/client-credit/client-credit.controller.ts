import {
  Body,
  Controller,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientCreditService } from './client-credit.service';
import { CreateClientCreditDto } from './dto/client-credit.dto';

@Controller('client-credit')
export class ClientCreditController {
  constructor(private readonly clientCreditService: ClientCreditService) {}

  @Post()
  @UsePipes(ValidationPipe)
  public async createClientCredit(
    @Body() createClientCredit: CreateClientCreditDto,
  ) {
    return await this.clientCreditService.createClientCredit(
      createClientCredit,
    );
  }
}
