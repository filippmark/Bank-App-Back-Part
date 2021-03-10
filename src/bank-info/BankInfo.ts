import * as moment from 'moment';

export class BankInfo {
  static currentBankDate: moment.Moment = moment().startOf('day');
}
