import { Controller, Get } from '@nestjs/common';
import { DisabilityService } from './disability.service';

@Controller('disability')
export class DisabilityController {
  constructor(private readonly disabilityService: DisabilityService) {}

  @Get()
  public async getAllDisabilities() {
    return await this.disabilityService.getAllDisabilities();
  }
}
