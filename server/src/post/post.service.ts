import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto, GetPostParamDto } from 'src/comments/comments.dto';
import CommentsEntity from 'src/entities/comments/comments.entity';
import { CommentsRepository } from 'src/entities/comments/comments.repository';
import PostEntity from 'src/entities/post/post.entity';
import { PostRepository } from 'src/entities/post/post.repository';
import { SubRepository } from 'src/entities/sub/sub.repository';
import UserEntity from 'src/entities/user/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(CommentsRepository)
    private commentRepo: CommentsRepository,
    @InjectRepository(SubRepository) private subRepo: SubRepository,
    @InjectRepository(PostRepository) private postRepo: PostRepository,
  ) {}

  async createPost(createPost: CreatePostDto, user: UserEntity) {
    const { title, body, sub } = createPost;
    if (title.trim() === '') {
      throw new NotFoundException('title must not be empty');
    }
    try {
      const subRecord = await this.subRepo.findOneOrFail({ name: sub });
      const post: Partial<PostEntity> = {
        title,
        body,
        user,
        sub: subRecord,
      };
      const result = await this.postRepo.create(post).save();
      return result;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getPosts() {
    try {
      const posts = await this.postRepo.find({ order: { createAt: 'DESC' } });
      return posts;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getPost(getPostParam: GetPostParamDto) {
    const { identifier, slug } = getPostParam;
    try {
      const post = await this.postRepo.findOneOrFail(
        { identifier, slug },
        { relations: ['sub'] },
      );
      return post;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
  async commentOnPost(
    getPostParam: GetPostParamDto,
    user: UserEntity,
    body: string,
  ) {
    const { identifier, slug } = getPostParam;
    try {
      const post = await this.postRepo.findOneOrFail({ identifier, slug });

      const comment: Partial<CommentsEntity> = {
        body,
        user,
        post,
      };
      const result = await this.commentRepo.create(comment).save();
      return result;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
