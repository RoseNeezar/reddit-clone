import {
  BadRequestException,
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
import * as fs from 'fs';
import { CreateSubDto } from './sub.dto';
import { getConnection } from 'typeorm';
import PostEntity from 'src/entities/post/post.entity';

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

  async uploadSubImage(
    name: string,
    user: UserEntity,
    type: string,
    file: any,
  ) {
    const sub = await this.subRepo.findOneOrFail({ where: { name: name } });

    if (sub.username !== user.username) {
      throw new BadRequestException('You dont own this sub');
    }

    if (type !== 'image' && type !== 'banner') {
      fs.unlinkSync(file.path);
      throw new BadRequestException('Invalid type');
    }

    try {
      let oldImageUrn: string = '';
      if (type === 'image') {
        oldImageUrn = sub.imageUrn ?? '';
        sub.imageUrn = file.filename;
      } else if (type === 'banner') {
        oldImageUrn = sub.bannerUrn ?? '';
        sub.bannerUrn = file.filename;
      }
      const result = await sub.save();
      if (oldImageUrn !== '') {
        fs.unlinkSync(`public/images/${oldImageUrn}`);
      }

      return result;
    } catch (err) {
      console.log(err);
      throw new BadRequestException();
    }
  }

  async topSubs() {
    try {
      const imageUrlExp = `COALESCE('${process.env.APP_URL}/images/' || s."imageUrn" , 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y')`;
      const subs = await getConnection()
        .createQueryBuilder()
        .select(
          `s.title, s.name, ${imageUrlExp} as "imageUrl", count(p.id) as "postCount"`,
        )
        .from(SubEntity, 's')
        .leftJoin(PostEntity, 'p', `s.name = p."subName"`)
        .groupBy('s.title, s.name, "imageUrl"')
        .orderBy(`"postCount"`, 'DESC')
        .limit(5)
        .execute();

      return subs;
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
