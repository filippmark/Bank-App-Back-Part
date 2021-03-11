import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateClientCreditDto } from './dto/client-credit.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientCreditRepository } from './client-credit.repository';
import { BillRepository } from '../bill/bill.repository';
import { BillService } from '../bill/bill.service';
import { BankInfo } from '../bank-info/BankInfo';
import { BigNumber } from 'bignumber.js';
import { ClientCredit } from './client-credit.entity';
import * as moment from 'moment';
import { Bill } from '../bill/bill.entity';

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

    const fixedCreditSum = Math.trunc(creditSum * 100);

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
      startCredit: BankInfo.currentBankDate.format(),
      creditSum: fixedCreditSum,
      mainBill,
      percentBill,
      isClosed: false,
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
      relations: ['mainBill', 'percentBill'],
    });
    return this.prepareClientDeposit(clientCredit);
  }

  public async getClientCreditService() {
    const clientCredits = await this.clientCreditRepository.find({
      relations: ['mainBill', 'percentBill'],
    });
    return clientCredits.map((clientCredit) =>
      this.prepareClientDeposit(clientCredit),
    );
  }

  public prepareClientDeposit(clientCredit: ClientCredit) {
    return {
      ...clientCredit,
      creditSum: clientCredit.creditSum / 100,
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

  public async getCreditPaymentPlan(id: number) {
    const clientCredit = await this.getClientCreditById(id);
    const result: { paymentDate: string; paymentPerMonth: number }[] = [];

    const percentPerMonth = clientCredit.credit.percent / (12 * 100);
    const countMonthes = clientCredit.credit.termInMs;
    if (clientCredit.credit.isAnnuity) {
      const annuityCoefficient =
        (percentPerMonth * Math.pow(1 + percentPerMonth, countMonthes)) /
        (Math.pow(1 + percentPerMonth, countMonthes) - 1);

      const paymentPerMonth = annuityCoefficient * clientCredit.creditSum;

      let paymentDate = moment(clientCredit.startCredit).add(1, 'months');
      for (let i = 0; i < countMonthes; i++) {
        result.push({
          paymentDate: paymentDate.format('DD-MM-YYYY'),
          paymentPerMonth,
        });

        paymentDate = paymentDate.add(1, 'months');
      }
    } else {
      let creditRest = clientCredit.creditSum;
      const monthlyReturningCreditBodyPart =
        clientCredit.creditSum / countMonthes;

      let paymentDate = moment(clientCredit.startCredit).add(1, 'months');
      for (let i = 0; i < countMonthes; i++) {
        const thisMonthPayment =
          monthlyReturningCreditBodyPart + creditRest * percentPerMonth;
        result.push({
          paymentDate: paymentDate.format('DD-MM-YYYY'),
          paymentPerMonth: thisMonthPayment,
        });

        creditRest -= monthlyReturningCreditBodyPart;
        paymentDate = paymentDate.add(1, 'months');
      }
    }

    return result;
  }

  public accrueCreditPercentage(
    clientCredit: ClientCredit,
    investmentBankAccount: Bill,
  ) {
    let percentAmount = 0;
    const countMonthes = clientCredit.credit.termInMs;
    const percentPerMonth = clientCredit.credit.percent / (12 * 100);

    if (clientCredit.credit.isAnnuity) {
      const anuityCoefficient =
        (percentPerMonth * Math.pow(1 + percentPerMonth, countMonthes)) /
        (Math.pow(1 + percentPerMonth, countMonthes) - 1);

      const paymentPerMonth = anuityCoefficient * clientCredit.creditSum;

      percentAmount = paymentPerMonth / 30;
    } else {
      let creditRest = clientCredit.creditSum;
      const dayReturningCreditBodyPart =
        clientCredit.creditSum / countMonthes / 30;
      const percentPerDay = percentPerMonth / 30;

      const amoontOfDays = moment
        .duration(
          BankInfo.currentBankDate.diff(moment(clientCredit.startCredit)),
        )
        .asDays();

      for (let i = 0; i < amoontOfDays; i++) {
        creditRest -= dayReturningCreditBodyPart;
      }

      percentAmount = dayReturningCreditBodyPart + creditRest * percentPerDay;
    }
    percentAmount = Math.trunc(percentAmount);
    const bigPercentAmount = new BigNumber(percentAmount);
    investmentBankAccount.credit = new BigNumber(investmentBankAccount.credit)
      .plus(bigPercentAmount)
      .toString();
    const percentBill = clientCredit.percentBill;
    percentBill.credit = new BigNumber(percentBill.credit)
      .plus(bigPercentAmount)
      .toString();
    this.billService.calculateBalanceForBill(percentBill);
    this.billService.calculateBalanceForBill(investmentBankAccount);
    return clientCredit;
  }

  public async closeCredit(id: number) {
    const clientCredit = await this.clientCreditRepository.findOne({
      where: {
        id,
      },
      relations: ['mainBill', 'percentBill'],
    });

    if (clientCredit.isClosed) {
      throw new BadRequestException('could not close already close credit');
    }
    if (
      moment(clientCredit.startCredit)
        .add(clientCredit.credit.termInMs, 'months')
        .isAfter(BankInfo.currentBankDate)
    ) {
      throw new BadRequestException('Cannot close credit before term ended');
    }

    const {
      investmentBankAccount,
      bankAccount,
    } = await this.billService.getBankAccountAndInvestmentBills();

    if (!clientCredit.credit.isAnnuity) {
      const amount = new BigNumber(clientCredit.creditSum);
      bankAccount.debit = new BigNumber(bankAccount.debit)
        .plus(amount)
        .toString();
      bankAccount.credit = new BigNumber(bankAccount.credit)
        .plus(amount)
        .toString();
      this.billService.calculateBalanceForBill(bankAccount);
      const mainBill = clientCredit.mainBill;
      mainBill.debit = new BigNumber(mainBill.debit).plus(amount).toString();
      mainBill.credit = new BigNumber(mainBill.credit).plus(amount).toString();
      this.billService.calculateBalanceForBill(mainBill);
      investmentBankAccount.credit = new BigNumber(investmentBankAccount.credit)
        .plus(amount)
        .toString();
      this.billService.calculateBalanceForBill(investmentBankAccount);
    }

    const bigNumberPercent = new BigNumber(
      clientCredit.percentBill.balance,
    ).absoluteValue();
    bankAccount.debit = new BigNumber(bankAccount.debit)
      .plus(bigNumberPercent)
      .toString();
    bankAccount.credit = new BigNumber(bankAccount.credit)
      .plus(bigNumberPercent)
      .toString();
    this.billService.calculateBalanceForBill(bankAccount);
    clientCredit.percentBill.debit = new BigNumber(
      clientCredit.percentBill.debit,
    )
      .plus(bigNumberPercent)
      .toString();
    this.billService.calculateBalanceForBill(clientCredit.percentBill);
    clientCredit.isClosed = true;

    await Promise.all([
      clientCredit.mainBill.save(),
      clientCredit.percentBill.save(),
      clientCredit.save(),
      bankAccount.save(),
      investmentBankAccount.save(),
    ]);

    return this.prepareClientDeposit(clientCredit);
  }

  public async payPercents(id: number) {
    const clientCredit = await this.clientCreditRepository.findOne({
      where: {
        id,
      },
      relations: ['mainBill', 'percentBill'],
    });
    if (clientCredit.percentBill.balance !== '0') {
      const bankAccount = await this.billService.getBankAccount();
      const bigNumberPercent = new BigNumber(
        clientCredit.percentBill.balance,
      ).absoluteValue();
      bankAccount.debit = new BigNumber(bankAccount.debit)
        .plus(bigNumberPercent)
        .toString();
      bankAccount.credit = new BigNumber(bankAccount.credit)
        .plus(bigNumberPercent)
        .toString();
      this.billService.calculateBalanceForBill(bankAccount);
      clientCredit.percentBill.debit = new BigNumber(
        clientCredit.percentBill.debit,
      )
        .plus(bigNumberPercent)
        .toString();
      this.billService.calculateBalanceForBill(clientCredit.percentBill);

      await Promise.all([bankAccount.save(), clientCredit.percentBill.save()]);

      return this.prepareClientDeposit(clientCredit);
    }
    throw new BadRequestException('Could not pay for 0 percents');
  }

  public async closeDay() {
    const clientCredits = await this.clientCreditRepository.find({
      where: {
        isClosed: false,
      },
      relations: ['mainBill', 'percentBill'],
    });
    const investmentBankAccount = await this.billService.getInvestmentBankAccount();
    await Promise.all([
      clientCredits.map(async (clientCredit) => {
        if (
          moment(clientCredit.startCredit)
            .add(clientCredit.credit.termInMs)
            .isSameOrAfter(BankInfo.currentBankDate)
        )
          this.accrueCreditPercentage(clientCredit, investmentBankAccount);
        return await clientCredit.percentBill.save();
      }),
    ]);
    await investmentBankAccount.save();
    return investmentBankAccount;
  }
}
