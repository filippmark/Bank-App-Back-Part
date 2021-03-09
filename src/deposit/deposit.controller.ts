import { Controller, Get, Post } from '@nestjs/common';
import { DepositService } from './deposit.service';

@Controller('deposit')
export class DepositController {
  constructor(private readonly depositService: DepositService) {}

  @Get()
  public async getAllDeposits() {
    return await this.depositService.getAllDeposits();
  }
}
