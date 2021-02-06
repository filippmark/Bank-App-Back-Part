import { EntityRepository, Repository } from 'typeorm';
import { Citizenship } from './citizenship.entity';

@EntityRepository(Citizenship)
export class CitizenshipRepository extends Repository<Citizenship> {}
