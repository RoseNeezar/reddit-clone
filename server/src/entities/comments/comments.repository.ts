import { EntityRepository, Repository } from 'typeorm';
import CommentsEntity from './comments.entity';

@EntityRepository(CommentsEntity)
export class CommentsRepository extends Repository<CommentsEntity> {}
