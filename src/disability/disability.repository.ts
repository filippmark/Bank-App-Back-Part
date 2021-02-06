import { EntityRepository, Repository } from 'typeorm';
import { Disability } from './disability.entity';

@EntityRepository(Disability)
export class DisabilityRepository extends Repository<Disability> {}
