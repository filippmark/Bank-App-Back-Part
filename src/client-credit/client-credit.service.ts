import { Injectable } from '@nestjs/common';
import { CreateClientCreditDto } from './dto/client-credit.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientCreditRepository } from './client-credit.repository';
import { BillRepository } from '../bill/bill.repository';
import { BillService } from '../bill/bill.service';

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
    const { creditId, clientId, startCredit, creditSum } = createClientCredit;

    const {
      mainBill,
      percentBill,
    } = await this.billService.createMainAndPercentBill(
      clientId,
      true,
      '2400',
      creditSum,
      creditSum,
    );

    await this.billService.updateBankAccountAndInvestmentBills(
      creditSum,
      creditSum,
      creditSum,
      0,
    );

    const clientCredit = this.clientCreditRepository.create({
      creditId,
      clientId,
      startCredit,
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
