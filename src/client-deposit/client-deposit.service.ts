import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientDepositRepository } from './client-deposit.repository';
import { BillRepository } from '../bill/bill.repository';
import { CreateClientDepositDto } from './dto/client-deposit.dto';
import { BillService } from '../bill/bill.service';
import { Bill } from '../bill/bill.entity';
import { ClientDeposit } from './client-deposit.entity';
import { BankInfo } from '../bank-info/BankInfo';
import moment from 'moment';

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
      startSum,
      withCapitalization,
    } = createClientDepositDto;

    const fixedStartSum = startSum * 100;

    const {
      mainBill,
      percentBill,
    } = await this.billService.createMainAndPercentBill(
      clientId,
      false,
      '3014',
      fixedStartSum,
      fixedStartSum,
    );

    await this.billService.updateBankAccountAndInvestmentBills(
      fixedStartSum,
      fixedStartSum,
      0,
      fixedStartSum,
    );

    const clientDeposit = this.clientDepositRepository.create({
      clientId,
      depositId,
      startDate: BankInfo.currentBankDate,
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

  private accrueDepositPercentageToBills(
    clientDeposit: ClientDeposit,
    investmentAccount: Bill,
    days: number,
  ) {
    const percentBill = clientDeposit.percentBill;
    const percentForMonth = (clientDeposit.deposit.percent / 365) * days;
    const earnedMoney = Math.trunc(percentForMonth * clientDeposit.startSum);
    investmentAccount.debit = investmentAccount.debit + earnedMoney;
    this.calculateBalanceForBill(investmentAccount);
    percentBill.credit = percentBill.credit + earnedMoney;
    this.calculateBalanceForBill(percentBill);
  }

  public async accrueDepositPercentage(id: number, days = 1) {
    const clientDeposit = await this.clientDepositRepository.findOne({
      where: {
        id,
      },
    });
    const investmentAccount = await this.billService.getInvestmentBankAccount();
    this.accrueDepositPercentageToBills(clientDeposit, investmentAccount, days);
    return await Promise.all([
      clientDeposit.percentBill.save(),
      investmentAccount.save(),
    ]);
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
    if (
      clientDeposit.deposit.isRevocable &&
      moment
        .duration(
          BankInfo.currentBankDate.diff(
            moment(clientDeposit.startDate.getTime()),
          ),
        )
        .asMonths() >= 1
    ) {
      const bankAccount = await this.billService.getBankAccount();
      const percentBill = clientDeposit.percentBill;
      await this.updateBillsAfterReceivingPercentsMoney(
        percentBill,
        bankAccount,
      );
      return await Promise.all([percentBill.save(), bankAccount.save()]);
    }
    throw new BadRequestException(
      'could not get money from not revocable bill',
    );
  }

  public async closeClientDeposit(id: number) {
    const clientDeposit = await this.clientDepositRepository.findOne({
      where: {
        id,
      },
    });

    if (
      clientDeposit.deposit.isRevocable ||
      (!clientDeposit.deposit.isRevocable &&
        moment(clientDeposit.startDate.getTime())
          .add(clientDeposit.deposit.termInMs, 'months')
          .isSameOrAfter(BankInfo.currentBankDate))
    ) {
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

      this.updateBillsAfterReceivingPercentsMoney(
        clientDeposit.percentBill,
        bankAccount,
      );

      clientDeposit.isClosed = true;
      return await Promise.all([
        clientDeposit.save(),
        investmentBankAccount.save(),
        bankAccount.save(),
      ]);
    }

    throw new BadRequestException('could not close deposit');
  }

  public async closeBank(countOfDays: number) {
    const clientDeposits = await this.clientDepositRepository.find({
      where: {
        isClosed: false,
      },
    });
    const investmentAccount = await this.billService.getInvestmentBankAccount();
    await Promise.all(
      clientDeposits.map(async (clientDeposit: ClientDeposit) => {
        this.accrueDepositPercentageToBills(
          clientDeposit,
          investmentAccount,
          countOfDays,
        );
        return await clientDeposit.percentBill.save();
      }),
    );
    BankInfo.currentBankDate.add(countOfDays, 'days');
    await investmentAccount.save();
  }

  public async getAllClientDeposits() {
    return await this.clientDepositRepository.find();
  }
}
