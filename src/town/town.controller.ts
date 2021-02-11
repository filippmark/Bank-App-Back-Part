import { Controller, Get } from '@nestjs/common';
import { TownService } from './town.service';

@Controller('town')
export class TownController {
  constructor(private readonly townService: TownService) {}

  @Get()
  public async getAllTowns() {
    return await this.townService.getAllTowns();
  }
}
