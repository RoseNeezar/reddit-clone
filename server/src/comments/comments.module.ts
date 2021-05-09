import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CommentsRepository } from 'src/entities/comments/comments.repository';
import { PostRepository } from 'src/entities/post/post.repository';
import { SubRepository } from 'src/entities/sub/sub.repository';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CommentsRepository,
      SubRepository,
      PostRepository,
    ]),
    AuthModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
