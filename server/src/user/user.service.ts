import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentsRepository } from 'src/entities/comments/comments.repository';
import { PostRepository } from 'src/entities/post/post.repository';
import { SubRepository } from 'src/entities/sub/sub.repository';
import UserEntity from 'src/entities/user/user.entity';
import { UserRepository } from 'src/entities/user/user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(CommentsRepository)
    private commentRepo: CommentsRepository,
    @InjectRepository(SubRepository) private subRepo: SubRepository,
    @InjectRepository(PostRepository) private postRepo: PostRepository,
    @InjectRepository(UserRepository) private userRepo: UserRepository,
  ) {}

  async getUserSubmissions(username: string, logUser: UserEntity) {
    try {
      const user = await this.userRepo.findOneOrFail({
        where: { username: username },
        select: ['username', 'createAt'],
      });

      const posts = await this.postRepo.find({
        where: { user },
        relations: ['comments', 'votes', 'sub'],
      });

      const comments = await this.commentRepo.find({
        where: { user },
        relations: ['post'],
      });
      if (logUser) {
        posts.forEach((p) => p.setUserVote(logUser));
        comments.forEach((c) => c.setUserVote(logUser));
      }

      let submissions: any[] = [];
      posts.forEach((p) => submissions.push({ type: 'Post', ...p.toJSON() }));
      comments.forEach((c) =>
        submissions.push({ type: 'Comment', ...c.toJSON() }),
      );

      submissions.sort((a, b) => {
        if (b.createdAt > a.createdAt) return 1;
        if (b.createdAt < a.createdAt) return -1;
        return 0;
      });

      return { user, submissions };
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
