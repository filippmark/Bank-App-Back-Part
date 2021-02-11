import { Controller, Get } from '@nestjs/common';
import { MaritalStatusService } from './marital-status.service';

@Controller('marital-status')
export class MaritalStatusController {
  constructor(private readonly maritalStatusService: MaritalStatusService) {}

  @Get()
  public async getAllMaritalStatuses() {
    return await this.maritalStatusService.getAllMaritalStatuses();
  }
}
