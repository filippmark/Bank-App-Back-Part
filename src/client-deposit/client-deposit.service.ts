import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientDepositRepository } from './client-deposit.repository';
import { BillRepository } from '../bill/bill.repository';
import { CreateClientDepositDto } from './dto/client-deposit.dto';
import { BillService } from '../bill/bill.service';
import { Bill } from '../bill/bill.entity';
import { ClientDeposit } from './client-deposit.entity';
import { BankInfo } from '../bank-info/BankInfo';
import * as moment from 'moment';
import { BigNumber } from 'bignumber.js';

@Injectable()
export class ClientDepositService {
  constructor(
    @InjectRepository(ClientDepositRepository)
    private readonly clientDepositRepository: ClientDepositRepository,
    @InjectRepository(BillRepository)
    private readonly billRepository: BillRepository,
    private readonly billService: BillService,
  ) {}

  public prepareClientDeposit(clientDeposit: ClientDeposit) {
    return {
      ...clientDeposit,
      startSum: clientDeposit.startSum / 100,
      deposit: {
        ...clientDeposit.deposit,
        minSum: clientDeposit.deposit.minSum / 100,
      },
      mainBill: {
        ...clientDeposit.mainBill,
        debit: new BigNumber(clientDeposit.mainBill.debit)
          .dividedBy(100)
          .toString(),
        credit: new BigNumber(clientDeposit.mainBill.credit)
          .dividedBy(100)
          .toString(),
        balance: new BigNumber(clientDeposit.mainBill.balance)
          .dividedBy(100)
          .toString(),
      },
      percentBill: {
        ...clientDeposit.percentBill,
        debit: new BigNumber(clientDeposit.percentBill.debit)
          .dividedBy(100)
          .toString(),
        credit: new BigNumber(clientDeposit.percentBill.credit)
          .dividedBy(100)
          .toString(),
        balance: new BigNumber(clientDeposit.percentBill.balance)
          .dividedBy(100)
          .toString(),
      },
    };
  }

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
      startDate: BankInfo.currentBankDate.format(),
      startSum: fixedStartSum,
      withCapitalization,
      mainBill,
      percentBill,
    });

    const savedClientDeposit = await this.clientDepositRepository.save(
      clientDeposit,
    );

    return savedClientDeposit;
  }

  private calculateBalanceForBill(bill: Bill) {
    if (bill.isActiveBill) {
      bill.balance = new BigNumber(bill.debit)
        .minus(new BigNumber(bill.credit))
        .toString();
    } else {
      bill.balance = new BigNumber(bill.credit)
        .minus(new BigNumber(bill.debit))
        .toString();
    }
  }

  private accrueDepositPercentageToBills(
    clientDeposit: ClientDeposit,
    investmentAccount: Bill,
    days: number,
  ) {
    const percentBill = clientDeposit.percentBill;
    const percentForMonth =
      (clientDeposit.deposit.percent / (365 * 100)) * days;
    const earnedMoney = Math.trunc(percentForMonth * clientDeposit.startSum);
    investmentAccount.debit = new BigNumber(investmentAccount.debit)
      .plus(new BigNumber(earnedMoney))
      .toString();
    this.calculateBalanceForBill(investmentAccount);
    percentBill.credit = new BigNumber(percentBill.credit)
      .plus(earnedMoney)
      .toString();
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
    const earnedMoney = new BigNumber(percentBill.credit);
    percentBill.debit = new BigNumber(percentBill.debit)
      .plus(earnedMoney)
      .toString();
    this.calculateBalanceForBill(percentBill);

    bankAccount.debit = new BigNumber(bankAccount.debit)
      .plus(earnedMoney)
      .toString();
    bankAccount.credit = new BigNumber(bankAccount.credit)
      .plus(earnedMoney)
      .toString();
    this.calculateBalanceForBill(bankAccount);
  }

  public async getMoneyFromPercentageBill(id: number) {
    const clientDeposit = await this.clientDepositRepository.findOne({
      where: {
        id,
      },
      relations: ['mainBill', 'percentBill'],
    });
    const amountOfDayPass = moment
      .duration(
        BankInfo.currentBankDate.diff(
          moment(clientDeposit.startDate.getTime()),
        ),
      )
      .asDays();
    const isAvailableToGetPercents = amountOfDayPass / 30 >= 1;
    if (
      clientDeposit.deposit.isRevocable &&
      isAvailableToGetPercents &&
      clientDeposit.percentBill.balance !== '0'
    ) {
      const bankAccount = await this.billService.getBankAccount();
      const percentBill = clientDeposit.percentBill;
      await this.updateBillsAfterReceivingPercentsMoney(
        percentBill,
        bankAccount,
      );
      await Promise.all([percentBill.save(), bankAccount.save()]);
      return this.prepareClientDeposit(clientDeposit);
    }
    if (!clientDeposit.deposit.isRevocable) {
      throw new BadRequestException(
        'could not get money from not revocable bill',
      );
    } else {
      throw new BadRequestException('pls take a time for percents');
    }
  }

  public async closeClientDeposit(id: number) {
    const clientDeposit = await this.clientDepositRepository.findOne({
      where: {
        id,
      },
      relations: ['mainBill', 'percentBill'],
    });

    if (
      clientDeposit.deposit.isRevocable ||
      (!clientDeposit.deposit.isRevocable &&
        moment(clientDeposit.startDate.getTime())
          .add(clientDeposit.deposit.termInMs, 'months')
          .isSameOrBefore(BankInfo.currentBankDate))
    ) {
      const {
        investmentBankAccount,
        bankAccount,
      } = await this.billService.getBankAccountAndInvestmentBills();
      const mainBill = clientDeposit.mainBill;
      investmentBankAccount.debit = new BigNumber(investmentBankAccount.debit)
        .plus(new BigNumber(clientDeposit.startSum))
        .toString();
      this.calculateBalanceForBill(investmentBankAccount);
      mainBill.credit = new BigNumber(mainBill.credit)
        .plus(new BigNumber(clientDeposit.startSum))
        .toString();
      mainBill.debit = new BigNumber(mainBill.debit)
        .plus(new BigNumber(clientDeposit.startSum))
        .toString();
      this.calculateBalanceForBill(mainBill);
      bankAccount.debit = new BigNumber(bankAccount.debit)
        .plus(new BigNumber(clientDeposit.startSum))
        .toString();
      bankAccount.credit = new BigNumber(bankAccount.credit)
        .plus(new BigNumber(clientDeposit.startSum))
        .toString();
      this.calculateBalanceForBill(bankAccount);

      if (clientDeposit.percentBill.balance !== '0') {
        this.updateBillsAfterReceivingPercentsMoney(
          clientDeposit.percentBill,
          bankAccount,
        );
      }

      clientDeposit.isClosed = true;
      await Promise.all([
        clientDeposit.save(),
        investmentBankAccount.save(),
        bankAccount.save(),
      ]);

      return this.prepareClientDeposit(clientDeposit);
    }

    throw new BadRequestException('could not close deposit');
  }

  public async closeBank(countOfDays: number) {
    const clientDeposits = await this.clientDepositRepository.find({
      where: {
        isClosed: false,
      },
      relations: ['mainBill', 'percentBill'],
    });
    const investmentAccount = await this.billService.getInvestmentBankAccount();
    await Promise.all(
      clientDeposits.map(async (clientDeposit: ClientDeposit) => {
        if (
          moment(clientDeposit.startDate.getTime())
            .add(clientDeposit.deposit.termInMs, 'months')
            .isSameOrAfter(BankInfo.currentBankDate)
        ) {
          this.accrueDepositPercentageToBills(
            clientDeposit,
            investmentAccount,
            countOfDays,
          );
          return await clientDeposit.percentBill.save();
        }
      }),
    );
    BankInfo.currentBankDate.add(countOfDays, 'days');
    console.log(BankInfo.currentBankDate);
    return await investmentAccount.save();
  }

  public async getAllClientDeposits() {
    return await this.clientDepositRepository.find();
  }

  public async getClientDepositById(id: number) {
    return await this.clientDepositRepository.findOne({
      where: {
        id,
      },
      relations: ['mainBill', 'percentBill'],
    });
  }
}
