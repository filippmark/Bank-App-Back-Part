import { Controller, Get } from '@nestjs/common';
import { BillService } from './bill.service';

@Controller('bill')
export class BillController {
  constructor(private readonly billService: BillService) {}

  @Get()
  public async getAllBills() {
    return await this.billService.getAllBills();
  }
}
