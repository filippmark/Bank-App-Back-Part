import { EntityRepository, Repository } from 'typeorm';
import { ClientDeposit } from './client-deposit.entity';

@EntityRepository(ClientDeposit)
export class ClientDepositRepository extends Repository<ClientDeposit> {}
