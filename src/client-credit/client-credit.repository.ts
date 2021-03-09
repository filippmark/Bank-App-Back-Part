import { EntityRepository, Repository } from 'typeorm';
import { ClientCredit } from './client-credit.entity';

@EntityRepository(ClientCredit)
export class ClientCreditRepository extends Repository<ClientCredit> {}
