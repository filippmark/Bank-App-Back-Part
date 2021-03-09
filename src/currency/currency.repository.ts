import { EntityRepository, Repository } from 'typeorm';
import { Currency } from './currency.entity';

@EntityRepository(Currency)
export class CurrencyRepository extends Repository<Currency> {}
