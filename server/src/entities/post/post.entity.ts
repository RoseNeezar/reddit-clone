import {
  Entity as TOEntity,
  Column,
  Index,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Entity from '../entity.entity';
import SubEntity from '../sub/sub.entity';
import UserEntity from '../user/user.entity';
import { makeId, slugify } from 'src/utils/helpers';

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

  @ManyToOne(() => UserEntity, (user) => user.posts)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: UserEntity;

  @ManyToOne(() => SubEntity, (sub) => sub.posts)
  @JoinColumn({ name: 'subName', referencedColumnName: 'name' })
  sub: SubEntity;

  @BeforeInsert()
  makeIdAndSlug() {
    this.identifier = makeId(7);
    this.slug = slugify(this.title);
  }
}
