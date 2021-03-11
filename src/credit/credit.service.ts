import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreditRepository } from './credit.repository';
import { Credit } from './credit.entity';

@Injectable()
export class CreditService {
  constructor(
    @InjectRepository(CreditRepository)
    private readonly creditRepository: CreditRepository,
  ) {}

  private prepareCredit(credit: Credit) {
    return {
      ...credit,
      maxSum: credit.maxSum / 100,
    };
  }

  public async getAllCredits() {
    const credits = await this.creditRepository.find({});
    return credits.map((credit) => this.prepareCredit(credit));
  }

  public async getCredit(id: number) {
    const credit = await this.creditRepository.findOne({
      where: {
        id,
      },
    });

    return this.prepareCredit(credit);
  }
}
