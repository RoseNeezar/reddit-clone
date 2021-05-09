import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsRepository } from 'src/entities/comments/comments.repository';
import { PostRepository } from 'src/entities/post/post.repository';
import { SubRepository } from 'src/entities/sub/sub.repository';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CommentsRepository,
      SubRepository,
      PostRepository,
    ]),
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
