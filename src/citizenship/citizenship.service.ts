import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CitizenshipRepository } from './citizenship.repository';

@Injectable()
export class CitizenshipService {
  constructor(
    @InjectRepository(CitizenshipRepository)
    private readonly citizenshipRepository,
  ) {}

  public async getAllCitizenships() {
    try {
      return await this.citizenshipRepository.find();
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
