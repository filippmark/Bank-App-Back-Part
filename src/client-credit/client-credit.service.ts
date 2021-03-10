import { Injectable } from '@nestjs/common';
import { CreateClientCreditDto } from './dto/client-credit.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientCreditRepository } from './client-credit.repository';
import { BillRepository } from '../bill/bill.repository';
import { BillService } from '../bill/bill.service';
import { BankInfo } from '../bank-info/BankInfo';
import { BigNumber } from 'bignumber.js';
import { ClientCredit } from './client-credit.entity';

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

    return savedClientCredit;
  }

  public async getClientCreditById(id: number) {
    const clientCredit = await this.clientCreditRepository.findOne({
      where: {
        id,
      },
    });
    return this.prepareClientDeposit(clientCredit);
  }

  public async getClientCreditService() {
    const clientCredits = await this.clientCreditRepository.find();
    return clientCredits.map((clientCredit) =>
      this.prepareClientDeposit(clientCredit),
    );
  }

  public prepareClientDeposit(clientCredit: ClientCredit) {
    return {
      ...clientCredit,
      startSum: clientCredit.creditSum / 100,
      credit: {
        ...clientCredit.credit,
        maxSum: clientCredit.credit.maxSum / 100,
      },
      mainBill: {
        ...clientCredit.mainBill,
        debit: new BigNumber(clientCredit.mainBill.debit)
          .dividedBy(100)
          .toString(),
        credit: new BigNumber(clientCredit.mainBill.credit)
          .dividedBy(100)
          .toString(),
        balance: new BigNumber(clientCredit.mainBill.balance)
          .dividedBy(100)
          .toString(),
      },
      percentBill: {
        ...clientCredit.percentBill,
        debit: new BigNumber(clientCredit.percentBill.debit)
          .dividedBy(100)
          .toString(),
        credit: new BigNumber(clientCredit.percentBill.credit)
          .dividedBy(100)
          .toString(),
        balance: new BigNumber(clientCredit.percentBill.balance)
          .dividedBy(100)
          .toString(),
      },
    };
  }
}
