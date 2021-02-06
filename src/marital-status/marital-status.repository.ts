import { EntityRepository, Repository } from 'typeorm';
import { MaritalStatus } from './marital-status.entity';

@EntityRepository(MaritalStatus)
export class MaritalStatusRepository extends Repository<MaritalStatus> {}
