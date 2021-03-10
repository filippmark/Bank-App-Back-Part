import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { DepositService } from './deposit.service';

@Controller('deposit')
export class DepositController {
  constructor(private readonly depositService: DepositService) {}

  @Get()
  public async getAllDeposits() {
    const deposits = await this.depositService.getAllDeposits();
    return deposits.map((deposit) => ({
      ...deposit,
      minSum: deposit.minSum / 100,
    }));
  }

  @Get('/:id')
  public async fetchDeposit(@Param('id', ParseIntPipe) id: number) {
    const deposit = await this.depositService.getDepositById(id);
    return {
      ...deposit,
      minSum: deposit.minSum / 100,
    };
  }
}
