import { EntityRepository, Repository } from 'typeorm';
import { Town } from './town.entity';

@EntityRepository(Town)
export class TownRepository extends Repository<Town> {}
