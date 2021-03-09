import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientDepositRepository } from './client-deposit.repository';
import { BillRepository } from '../bill/bill.repository';
import { CreateClientDepositDto } from './dto/client-deposit.dto';
import { BillService } from '../bill/bill.service';
import { Bill } from '../bill/bill.entity';

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

  private calculateBalanceForBill(bill: Bill) {
    if (bill.isActiveBill) {
      bill.balance = bill.debit - bill.credit;
    } else {
      bill.balance = bill.credit - bill.debit;
    }
  }

  public async accrueDepositPercentage(id: number) {
    const clientDeposit = await this.clientDepositRepository.findOne({
      where: {
        id,
      },
    });
    const investmentAccount = await this.billService.getInvestmentBankAccount();
    const percentBill = clientDeposit.percentBill;
    const percentForMonth = (clientDeposit.deposit.percent / 365) * 30;
    const earnedMoney = Math.trunc(percentForMonth * clientDeposit.startSum);
    investmentAccount.debit = investmentAccount.debit + earnedMoney;
    this.calculateBalanceForBill(investmentAccount);
    percentBill.credit = percentBill.credit + earnedMoney;
    this.calculateBalanceForBill(percentBill);
    return await Promise.all([percentBill.save(), investmentAccount.save()]);
  }

  private updateBillsAfterReceivingPercentsMoney(
    percentBill: Bill,
    bankAccount: Bill,
  ) {
    const earnedMoney = percentBill.credit;
    percentBill.debit = percentBill.debit + earnedMoney;
    this.calculateBalanceForBill(percentBill);

    bankAccount.debit = bankAccount.debit + earnedMoney;
    bankAccount.credit = bankAccount.credit + earnedMoney;
    this.calculateBalanceForBill(bankAccount);
  }

  public async getMoneyFromPercentageBill(id: number) {
    const clientDeposit = await this.clientDepositRepository.findOne({
      where: {
        id,
      },
    });
    const bankAccount = await this.billService.getBankAccount();
    const percentBill = clientDeposit.percentBill;
    await this.updateBillsAfterReceivingPercentsMoney(percentBill, bankAccount);
    return await Promise.all([percentBill.save(), bankAccount.save()]);
  }

  public async closeClientDeposit(id: number) {
    const clientDeposit = await this.clientDepositRepository.findOne({
      where: {
        id,
      },
    });
    const {
      investmentBankAccount,
      bankAccount,
    } = await this.billService.getBankAccountAndInvestmentBills();
    const mainBill = clientDeposit.mainBill;
    investmentBankAccount.debit =
      investmentBankAccount.debit + clientDeposit.startSum;
    this.calculateBalanceForBill(investmentBankAccount);
    mainBill.credit = mainBill.credit + clientDeposit.startSum;
    mainBill.debit = mainBill.debit + clientDeposit.startSum;
    this.calculateBalanceForBill(mainBill);
    bankAccount.debit = bankAccount.debit + clientDeposit.startSum;
    bankAccount.credit = bankAccount.credit + clientDeposit.startSum;
    this.calculateBalanceForBill(bankAccount);

    const deposit = clientDeposit.deposit;
    if (!deposit.isRevocable) {
      this.updateBillsAfterReceivingPercentsMoney(
        clientDeposit.percentBill,
        bankAccount,
      );
    }

    clientDeposit.isClosed = false;
    return await Promise.all([
      clientDeposit.save(),
      investmentBankAccount.save(),
      bankAccount.save(),
    ]);
  }
}
