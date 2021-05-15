import { Expose } from 'class-transformer';
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

  @Column()
  username: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: UserEntity;

  @OneToMany(() => PostEntity, (post) => post.sub)
  posts: PostEntity[];

  @Expose()
  get imageUrl(): string {
    return this.imageUrn
      ? `https://roseneezar.dev/r/leddit/images/${this.imageUrn}`
      : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
  }

  @Expose()
  get bannerUrl(): string | undefined {
    return this.bannerUrn
      ? `https://roseneezar.dev/r/leddit/images/${this.bannerUrn}`
      : undefined;
  }
}
