import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentsRepository } from 'src/entities/comments/comments.repository';
import { PostRepository } from 'src/entities/post/post.repository';
import SubEntity from 'src/entities/sub/sub.entity';
import { SubRepository } from 'src/entities/sub/sub.repository';
import UserEntity from 'src/entities/user/user.entity';
import { getRepository } from 'typeorm';
import { CreateSubDto } from './sub.dto';

@Injectable()
export class SubsService {
  constructor(
    @InjectRepository(CommentsRepository)
    private commentRepo: CommentsRepository,
    @InjectRepository(SubRepository) private subRepo: SubRepository,
    @InjectRepository(PostRepository) private postRepo: PostRepository,
  ) {}

  async createSub(createSub: CreateSubDto, user: UserEntity) {
    const { title, name, description } = createSub;

    const sub = await this.subRepo
      .createQueryBuilder('sub')
      .where('lower(sub.name) = :name', { name: name.toLowerCase() })
      .getOne();

    if (sub) {
      throw new ConflictException('Sub exists already');
    }
    try {
      const sub: Partial<SubEntity> = {
        name,
        description,
        title,
        user,
      };
      const result = await this.subRepo.create(sub).save();
      return result;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getSub(name: string, user?: UserEntity) {
    try {
      const sub = await this.subRepo.findOneOrFail({ name });

      const posts = await this.postRepo.find({
        where: { sub },
        order: { createAt: 'DESC' },
        relations: ['comments', 'votes'],
      });

      sub.posts = posts;

      if (user) {
        sub.posts.forEach((p) => p.setUserVote(user));
      }

      return sub;
    } catch (err) {
      throw new NotFoundException('Subs not found');
    }
  }
}
