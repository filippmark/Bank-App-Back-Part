import { EntityRepository, Repository } from 'typeorm';
import { Credit } from './credit.entity';

@EntityRepository(Credit)
export class CreditRepository extends Repository<Credit> {}
