import { IsEmail, Length } from 'class-validator';
import {
  Entity as TOEntity,
  Column,
  Index,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import PostEntity from '../post/post.entity';
import Entity from '../entity.entity';
import VotesEntity from '../votes/votes.entity';

@TOEntity('users')
export default class UserEntity extends Entity {
  constructor(user: Partial<UserEntity>) {
    super();
    Object.assign(this, user);
  }

  @Index()
  @IsEmail()
  @Column({ unique: true })
  email: string;

  @Index()
  @Length(3, 255, { message: 'Username must be at least 3 characters long' })
  @Column({ unique: true })
  username: string;

  @Exclude()
  @Column()
  @Length(6, 255)
  password: string;

  @OneToMany(() => PostEntity, (post) => post.user)
  posts: PostEntity[];

  @OneToMany(() => VotesEntity, (vote) => vote.user)
  votes: VotesEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 6);
  }
}
