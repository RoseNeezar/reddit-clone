import {
  BadRequestException,
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
import { EntityNotFoundError } from 'typeorm';
import { GetPaginatedPostParamDto } from './post.dto';

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
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException('Sub not found');
      }
      throw new InternalServerErrorException();
    }
  }

  async getPosts(post?: GetPaginatedPostParamDto, user?: UserEntity) {
    const { count, page } = post;
    const currentPage: number = (page || 0) as number;
    const postsPerPage: number = (count || 8) as number;
    try {
      const posts = await this.postRepo.find({
        order: { createAt: 'DESC' },
        relations: ['comments', 'votes', 'sub'],
        skip: currentPage * postsPerPage,
        take: postsPerPage,
      });

      if (user) {
        posts.forEach((p) => p.setUserVote(user));
      }

      return posts;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getPost(getPostParam: GetPostParamDto, user: UserEntity) {
    const { identifier, slug } = getPostParam;

    try {
      const post = await this.postRepo.findOneOrFail(
        { identifier, slug },
        { relations: ['sub', 'votes', 'comments'] },
      );
      if (user) {
        post.setUserVote(user);
      }
      return post;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException('Sub not found');
      }
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

  async getPostComments(getPostParam: GetPostParamDto, user?: UserEntity) {
    const { identifier, slug } = getPostParam;
    try {
      const post = await this.postRepo.findOneOrFail({ identifier, slug });

      const comments = await this.commentRepo.find({
        where: { post },
        order: { createAt: 'DESC' },
        relations: ['votes'],
      });
      if (user) {
        comments.forEach((c) => c.setUserVote(user));
      }
      return comments;
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
