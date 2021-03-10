import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
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

  @Get('/:id')
  public async fetchClientDeposit(@Param('id') id: number) {
    const clientDeposit = await this.clientDepositService.getClientDepositById(
      id,
    );

    return this.clientDepositService.prepareClientDeposit(clientDeposit);
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
  public async accrueDepositPercentage(@Param('id', ParseIntPipe) id: number) {
    return await this.clientDepositService.accrueDepositPercentage(id);
  }

  @Patch('closeClientDeposit/:id')
  public async closeClientDeposit(@Param('id', ParseIntPipe) id: number) {
    return await this.clientDepositService.closeClientDeposit(id);
  }

  @Patch('getMoneyFromPercentBill/:id')
  public async getMoneyFromPercentBill(@Param('id', ParseIntPipe) id: number) {
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
