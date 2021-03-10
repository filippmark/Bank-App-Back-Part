import { Injectable } from '@nestjs/common';
import { CreateClientCreditDto } from './dto/client-credit.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientCreditRepository } from './client-credit.repository';
import { BillRepository } from '../bill/bill.repository';
import { BillService } from '../bill/bill.service';
import { BankInfo } from '../bank-info/BankInfo';

@Injectable()
export class ClientCreditService {
  constructor(
    @InjectRepository(ClientCreditRepository)
    private readonly clientCreditRepository: ClientCreditRepository,
    @InjectRepository(BillRepository)
    private readonly billRepository: BillRepository,
    private readonly billService: BillService,
  ) {}

  public async createClientCredit(createClientCredit: CreateClientCreditDto) {
    const { creditId, clientId, creditSum } = createClientCredit;

    const fixedCreditSum = creditSum * 100;

    const {
      mainBill,
      percentBill,
    } = await this.billService.createMainAndPercentBill(
      clientId,
      true,
      '2400',
      fixedCreditSum,
      fixedCreditSum,
    );

    await this.billService.updateBankAccountAndInvestmentBills(
      fixedCreditSum,
      fixedCreditSum,
      fixedCreditSum,
      0,
    );

    const clientCredit = this.clientCreditRepository.create({
      creditId,
      clientId,
      startCredit: BankInfo.currentBankDate,
      creditSum,
      mainBill,
      percentBill,
    });

    const savedClientCredit = await this.clientCreditRepository.save(
      clientCredit,
    );

    console.log(savedClientCredit);
  }
}
