import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientDepositService } from './client-deposit.service';
import { CreateClientDepositDto } from './dto/client-deposit.dto';

@Controller('client-deposit')
export class ClientDepositController {
  constructor(private readonly clientDepositService: ClientDepositService) {}

  @Post()
  @UsePipes(ValidationPipe)
  public async createClientDeposit(
    @Body() createClientDeposit: CreateClientDepositDto,
  ) {
    return await this.clientDepositService.createClientDeposit(
      createClientDeposit,
    );
  }
}
