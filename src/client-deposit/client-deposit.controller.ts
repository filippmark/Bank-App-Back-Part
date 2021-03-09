import {
  Body,
  Controller,
  ParseIntPipe,
  Patch,
  Post,
  Query,
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

  @Patch()
  public async accrueDepositPercentage(@Query('id', ParseIntPipe) id: number) {
    return await this.clientDepositService.accrueDepositPercentage(id);
  }

  @Patch()
  public async closeClientDeposit(@Query('id', ParseIntPipe) id: number) {
    return await this.clientDepositService.closeClientDeposit(id);
  }

  @Patch()
  public async getMoneyFromPercentBill(@Query('id', ParseIntPipe) id: number) {
    return await this.clientDepositService.getMoneyFromPercentageBill(id);
  }
}
