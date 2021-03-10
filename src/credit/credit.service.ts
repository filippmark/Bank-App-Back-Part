import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreditRepository } from './credit.repository';

@Injectable()
export class CreditService {
  constructor(
    @InjectRepository(CreditRepository)
    private readonly creditRepository: CreditRepository,
  ) {}

  public async getAllCredits() {
    return await this.creditRepository.find({});
  }

  public async getCredit(id: number) {
    return await this.creditRepository.findOne({
      where: {
        id,
      },
    });
  }
}
