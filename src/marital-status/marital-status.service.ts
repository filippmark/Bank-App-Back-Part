import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MaritalStatusRepository } from './marital-status.repository';
import { MaritalStatus } from './marital-status.entity';

@Injectable()
export class MaritalStatusService {
  constructor(
    @InjectRepository(MaritalStatusRepository)
    private readonly maritalStatusRepository: MaritalStatusRepository,
  ) {}

  public async getAllMaritalStatuses(): Promise<MaritalStatus[]> {
    try {
      return await this.maritalStatusRepository.find();
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
