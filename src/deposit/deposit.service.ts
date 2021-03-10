import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DepositRepository } from './deposit.repository';

@Injectable()
export class DepositService {
  constructor(
    @InjectRepository(DepositRepository)
    private readonly depositRepository: DepositRepository,
  ) {}

  public async getAllDeposits() {
    return await this.depositRepository.find({
      where: {},
    });
  }

  public async getDepositById(id: number) {
    return await this.depositRepository.findOne({
      where: {
        id,
      },
    });
  }
}
