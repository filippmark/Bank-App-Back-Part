import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BillRepository } from './bill.repository';
import { Bill } from './bill.entity';
import { BigNumber } from 'bignumber.js';

@Injectable()
export class BillService {
  constructor(
    @InjectRepository(BillRepository)
    private readonly billRepository: BillRepository,
  ) {}

  private calculateKeyForAccount(accountCurrent: string): number {
    return (
      accountCurrent
        .split('')
        .reduce(
          (accum: number, current: string) => accum + parseInt(current, 10),
          0,
        ) % 10
    );
  }

  public calculateBalanceForBill(bill: Bill) {
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

  public async createMainAndPercentBill(
    clientId: string,
    isActiveBill: boolean,
    accountNumber: string,
    debitMain: number,
    creditMain: number,
  ): Promise<{ mainBill: Bill; percentBill: Bill }> {
    let amountOfBills = (await this.billRepository.count()) + 1;

    console.log(amountOfBills);

    const currentBillIndividualId = amountOfBills.toString(10).padStart(8, '0');
    const accountCurrent = `${accountNumber}${currentBillIndividualId}`;
    const keyCurrentBill = this.calculateKeyForAccount(accountCurrent);

    amountOfBills++;
    const percentBillIndividualId = amountOfBills.toString(10).padStart(8, '0');
    const accountPercent = `${accountNumber}${percentBillIndividualId}`;
    const keyPercentBill = this.calculateKeyForAccount(accountPercent);

    const mainBill = this.billRepository.create({
      account: `${accountCurrent}${keyCurrentBill}`,
      debit: debitMain.toString(),
      credit: creditMain.toString(),
      balance: '0',
      isActiveBill,
      clientId,
      isClosed: false,
    });

    const percentBill = this.billRepository.create({
      account: `${accountPercent}${keyPercentBill}`,
      debit: '0',
      credit: '0',
      balance: '0',
      isActiveBill,
      clientId,
      isClosed: false,
    });

    return { mainBill, percentBill };
  }

  public async getBankAccount(): Promise<Bill> {
    return await this.billRepository.findOne({
      where: {
        account: '1010000000002',
      },
    });
  }

  public async getInvestmentBankAccount(): Promise<Bill> {
    return await this.billRepository.findOne({
      where: {
        account: '7327000000009',
      },
    });
  }

  public async getBankAccountAndInvestmentBills() {
    const bills = await Promise.all([
      this.getBankAccount(),
      this.getInvestmentBankAccount(),
    ]);

    return {
      bankAccount: bills[0],
      investmentBankAccount: bills[1],
    };
  }

  public async updateBankAccountAndInvestmentBills(
    bankAccountCredit: number,
    bankAccountDebit: number,
    investmentBankAccountDebit: number,
    investmentBankAccountCredit: number,
  ) {
    const {
      bankAccount,
      investmentBankAccount,
    } = await this.getBankAccountAndInvestmentBills();

    bankAccount.debit = new BigNumber(bankAccount.debit)
      .plus(new BigNumber(bankAccountDebit))
      .toString();
    bankAccount.credit = new BigNumber(bankAccount.credit)
      .plus(new BigNumber(bankAccountCredit))
      .toString();
    bankAccount.balance = new BigNumber(bankAccount.debit)
      .minus(new BigNumber(bankAccount.debit))
      .toString();

    investmentBankAccount.debit = new BigNumber(investmentBankAccount.debit)
      .plus(new BigNumber(investmentBankAccountDebit))
      .toString();
    investmentBankAccount.credit = new BigNumber(investmentBankAccount.credit)
      .plus(new BigNumber(investmentBankAccountCredit))
      .toString();
    investmentBankAccount.balance = new BigNumber(investmentBankAccount.credit)
      .minus(new BigNumber(investmentBankAccount.debit))
      .toString();

    await Promise.all([bankAccount.save(), investmentBankAccount.save()]);
  }

  public async getAllBills() {
    return await this.billRepository.find();
  }
}
