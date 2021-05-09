import {
  Entity as TOEntity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import Entity from '../entity.entity';
import PostEntity from '../post/post.entity';
import UserEntity from '../user/user.entity';

@TOEntity('subs')
export default class SubEntity extends Entity {
  constructor(sub: Partial<SubEntity>) {
    super();
    Object.assign(this, sub);
  }

  @Index()
  @Column({ unique: true })
  name: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  imageUrn: string;

  @Column({ nullable: true })
  bannerUrn: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: UserEntity;

  @OneToMany(() => PostEntity, (post) => post.sub)
  posts: PostEntity[];
}
