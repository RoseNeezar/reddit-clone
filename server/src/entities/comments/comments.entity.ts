import {
  BeforeInsert,
  Column,
  Entity as TOEntity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { Exclude } from 'class-transformer';
import Entity from '../entity.entity';
import UserEntity from '../user/user.entity';
import PostEntity from '../post/post.entity';
import { makeId } from 'src/utils/helpers';
import VotesEntity from '../votes/votes.entity';

@TOEntity('comments')
export default class CommentsEntity extends Entity {
  constructor(comment: Partial<Comment>) {
    super();
    Object.assign(this, comment);
  }

  @Index()
  @Column()
  identifier: string;

  @Column()
  body: string;

  @Column()
  username: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: UserEntity;

  @ManyToOne(() => PostEntity, (post) => post.comments, { nullable: false })
  post: PostEntity;

  @Exclude()
  @OneToMany(() => VotesEntity, (vote) => vote.comment)
  votes: VotesEntity[];

  protected userVote: number;
  setUserVote(user: UserEntity) {
    const index = this.votes?.findIndex((v) => v.username === user.username);
    this.userVote = index > -1 ? this.votes[index].value : 0;
  }

  @BeforeInsert()
  makeIdAndSlug() {
    this.identifier = makeId(8);
  }
}
