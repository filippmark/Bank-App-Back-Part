import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BillRepository } from './bill.repository';
import { Bill } from './bill.entity';

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

  public async createMainAndPercentBill(
    clientId: string,
    isActiveBill: boolean,
    accountNumber: string,
    debitMain: number,
    creditMain: number,
  ): Promise<{ mainBill: Bill; percentBill: Bill }> {
    let amountOfBills = await this.billRepository.count();

    const currentBillIndividualId = amountOfBills.toString(10).padStart(8, '0');
    const accountCurrent = `${accountNumber}${currentBillIndividualId}`;
    const keyCurrentBill = this.calculateKeyForAccount(accountCurrent);

    amountOfBills++;
    const percentBillIndividualId = amountOfBills.toString(10).padStart(8, '0');
    const accountPercent = `${accountNumber}${percentBillIndividualId}`;
    const keyPercentBill = this.calculateKeyForAccount(accountPercent);

    const mainBill = this.billRepository.create({
      account: `${accountCurrent}${keyCurrentBill}`,
      debit: debitMain,
      credit: creditMain,
      balance: 0,
      isActiveBill,
      clientId,
      isClosed: false,
    });

    const percentBill = this.billRepository.create({
      account: `${accountPercent}${keyPercentBill}`,
      debit: 0,
      credit: 0,
      balance: 0,
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

    bankAccount.debit = bankAccount.debit + bankAccountDebit;
    bankAccount.credit = bankAccount.credit + bankAccountCredit;
    bankAccount.balance = bankAccount.debit - bankAccount.credit;

    investmentBankAccount.debit =
      investmentBankAccount.debit + investmentBankAccountDebit;
    investmentBankAccount.credit =
      investmentBankAccount.credit + investmentBankAccountCredit;
    investmentBankAccount.balance =
      investmentBankAccount.credit - investmentBankAccount.debit;

    await Promise.all([bankAccount.save(), investmentBankAccount.save()]);
  }
}
