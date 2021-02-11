import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DisabilityRepository } from './disability.repository';

@Injectable()
export class DisabilityService {
  constructor(
    @InjectRepository(DisabilityRepository)
    private readonly disabilityRepository: DisabilityRepository,
  ) {}

  public async getAllDisabilities() {
    try {
      return await this.disabilityRepository.find();
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
