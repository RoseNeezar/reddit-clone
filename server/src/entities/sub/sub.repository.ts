import { EntityRepository, Repository } from 'typeorm';
import SubEntity from './sub.entity';

@EntityRepository(SubEntity)
export class SubRepository extends Repository<SubEntity> {}
