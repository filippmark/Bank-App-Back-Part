import { Controller, Get } from '@nestjs/common';
import { BillService } from './bill.service';
import BigNumber from 'bignumber.js';

@Controller('bill')
export class BillController {
  constructor(private readonly billService: BillService) {}

  @Get()
  public async getAllBills() {
    const bills = await this.billService.getAllBills();
    return bills.map((bill) => ({
      ...bill,
      credit: new BigNumber(bill.credit).dividedBy(100),
      debit: new BigNumber(bill.debit).dividedBy(100),
      balance: new BigNumber(bill.balance).dividedBy(100),
    }));
  }
}
