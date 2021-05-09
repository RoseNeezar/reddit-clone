import {
  Entity as TOEntity,
  Column,
  Index,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import Entity from '../entity.entity';
import UserEntity from '../user/user.entity';
import SubEntity from '../sub/sub.entity';
import { makeId, slugify } from 'src/utils/helpers';
import CommentsEntity from '../comments/comments.entity';
import VotesEntity from '../votes/votes.entity';

@TOEntity('posts')
export default class PostEntity extends Entity {
  constructor(post: Partial<PostEntity>) {
    super();
    Object.assign(this, post);
  }

  @Index()
  @Column()
  identifier: string; // 7 Character Id

  @Column()
  title: string;

  @Index()
  @Column()
  slug: string;

  @Column({ nullable: true, type: 'text' })
  body: string;

  @Column()
  subName: string;

  @Column()
  username: string;

  @ManyToOne(() => UserEntity, (user) => user.posts)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: UserEntity;

  @ManyToOne(() => SubEntity, (sub) => sub.posts)
  @JoinColumn({ name: 'subName', referencedColumnName: 'name' })
  sub: SubEntity;

  @OneToMany(() => CommentsEntity, (comment) => comment.post)
  comments: CommentsEntity[];

  @Exclude()
  @OneToMany(() => VotesEntity, (vote) => vote.post)
  votes: VotesEntity[];

  @Expose() get url(): string {
    return `/r/${this.subName}/${this.identifier}/${this.slug}`;
  }

  @Expose() get commentCount(): number {
    return this.comments?.length;
  }

  @Expose() get voteScore(): number {
    return this.votes?.reduce((prev, curr) => prev + (curr.value || 0), 0);
  }

  protected userVote: number;
  setUserVote(user: UserEntity) {
    const index = this.votes?.findIndex((v) => v.username === user.username);
    this.userVote = index > -1 ? this.votes[index].value : 0;
  }

  @BeforeInsert()
  makeIdAndSlug() {
    this.identifier = makeId(7);
    this.slug = slugify(this.title);
  }
}
