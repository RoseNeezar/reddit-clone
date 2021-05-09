import { Entity as TOEntity, Column, ManyToOne, JoinColumn } from 'typeorm';
import Entity from '../entity.entity';
import PostEntity from '../post/post.entity';
import UserEntity from '../user/user.entity';

@TOEntity('votes')
export default class VotesEntity extends Entity {
  constructor(vote: Partial<VotesEntity>) {
    super();
    Object.assign(this, vote);
  }

  @Column()
  value: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: UserEntity;

  @Column()
  username: string;

  @ManyToOne(() => PostEntity)
  post: PostEntity;

  @ManyToOne(() => Comment)
  comment: Comment;
}
