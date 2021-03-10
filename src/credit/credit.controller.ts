import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CreditService } from './credit.service';

@Controller('credit')
export class CreditController {
  constructor(readonly creditService: CreditService) {}

  @Get()
  public async getAllCredits() {
    return this.creditService.getAllCredits();
  }

  @Get('/:id')
  public async getAllCredit(@Param('id', ParseIntPipe) id: number) {
    return await this.creditService.getCredit(id);
  }
}
