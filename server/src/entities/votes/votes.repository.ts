import { EntityRepository, Repository } from 'typeorm';
import VotesEntity from './votes.entity';

@EntityRepository(VotesEntity)
export class VotesRepository extends Repository<VotesEntity> {}
