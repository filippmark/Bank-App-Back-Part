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
import { ClientCreditService } from './client-credit.service';
import { CreateClientCreditDto } from './dto/client-credit.dto';

@Controller('client-credit')
export class ClientCreditController {
  constructor(private readonly clientCreditService: ClientCreditService) {}

  @Get()
  public async getClientCredits() {
    return await this.clientCreditService.getClientCreditService();
  }

  @Get('/:id')
  public async getClientCredit(@Param('id', ParseIntPipe) id: number) {
    return await this.clientCreditService.getClientCreditById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  public async createClientCredit(
    @Body() createClientCredit: CreateClientCreditDto,
  ) {
    return await this.clientCreditService.createClientCredit(
      createClientCredit,
    );
  }

  @Get('/payment-plan/:id')
  public async getCreditPaymentPlan(@Param('id', ParseIntPipe) id: number) {
    return await this.clientCreditService.getCreditPaymentPlan(id);
  }

  @Patch('/pay-percents/:id')
  public async payPercents(@Param('id', ParseIntPipe) id: number) {
    return await this.clientCreditService.payPercents(id);
  }

  @Patch('/close-credit/:id')
  public async closeCredit(@Param('id', ParseIntPipe) id: number) {
    return await this.clientCreditService.closeCredit(id);
  }

  @Patch('close-day')
  public async closeDay() {
    return await this.clientCreditService.closeDay();
  }
}
