import { Controller, Get } from '@nestjs/common';
import { CitizenshipService } from './citizenship.service';

@Controller('citizenship')
export class CitizenshipController {
  constructor(private readonly citizenshipService: CitizenshipService) {}

  @Get()
  public async getAllCitizenships() {
    return await this.citizenshipService.getAllCitizenships();
  }
}
