import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TownRepository } from './town.repository';
import { Town } from './town.entity';

@Injectable()
export class TownService {
  constructor(
    @InjectRepository(TownRepository)
    private readonly townRepository: TownRepository,
  ) {}

  public async getAllTowns(): Promise<Town[]> {
    try {
      return await this.townRepository.find();
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
