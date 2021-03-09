import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientDepositRepository } from './client-deposit.repository';
import { BillRepository } from '../bill/bill.repository';
import { CreateClientDepositDto } from './dto/client-deposit.dto';
import { BillService } from '../bill/bill.service';

@Injectable()
export class ClientDepositService {
  constructor(
    @InjectRepository(ClientDepositRepository)
    private readonly clientDepositRepository: ClientDepositRepository,
    @InjectRepository(BillRepository)
    private readonly billRepository: BillRepository,
    private readonly billService: BillService,
  ) {}

  public async createClientDeposit(
    createClientDepositDto: CreateClientDepositDto,
  ) {
    const {
      clientId,
      depositId,
      startDate,
      startSum,
      withCapitalization,
    } = createClientDepositDto;

    const {
      mainBill,
      percentBill,
    } = await this.billService.createMainAndPercentBill(
      clientId,
      false,
      '3014',
      startSum,
      startSum,
    );

    await this.billService.updateBankAccountAndInvestmentBills(
      startSum,
      startSum,
      0,
      startSum,
    );

    const clientDeposit = this.clientDepositRepository.create({
      clientId,
      depositId,
      startDate,
      startSum,
      withCapitalization,
      mainBill,
      percentBill,
    });

    const savedClientDeposit = await this.clientDepositRepository.save(
      clientDeposit,
    );

    console.log(savedClientDeposit);
  }
}
