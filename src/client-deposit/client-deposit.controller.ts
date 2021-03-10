import {
  Body,
  Controller,
  Get,
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

  @Get()
  public async getAllClientDeposits() {
    return await this.clientDepositService.getAllClientDeposits();
  }

  @Post()
  @UsePipes(ValidationPipe)
  public async createClientDeposit(
    @Body() createClientDeposit: CreateClientDepositDto,
  ) {
    return await this.clientDepositService.createClientDeposit(
      createClientDeposit,
    );
  }

  @Patch('accrueDepositPercentage/:id')
  public async accrueDepositPercentage(@Query('id', ParseIntPipe) id: number) {
    return await this.clientDepositService.accrueDepositPercentage(id);
  }

  @Patch('closeClientDeposit/:id')
  public async closeClientDeposit(@Query('id', ParseIntPipe) id: number) {
    return await this.clientDepositService.closeClientDeposit(id);
  }

  @Patch('getMoneyFromPercentBill/:id')
  public async getMoneyFromPercentBill(@Query('id', ParseIntPipe) id: number) {
    return await this.clientDepositService.getMoneyFromPercentageBill(id);
  }

  @Patch('closeBankDay')
  public async closeBankDay() {
    return await this.clientDepositService.closeBank(1);
  }

  @Patch('closeBankMonth')
  public async closeBankMonth() {
    return await this.clientDepositService.closeBank(30);
  }
}
