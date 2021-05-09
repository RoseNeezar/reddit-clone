import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CommentsRepository } from 'src/entities/comments/comments.repository';
import { PostRepository } from 'src/entities/post/post.repository';
import { SubRepository } from 'src/entities/sub/sub.repository';
import { VotesRepository } from 'src/entities/votes/votes.repository';
import { VoteController } from './vote.controller';
import { VoteService } from './vote.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CommentsRepository,
      SubRepository,
      PostRepository,
      VotesRepository,
    ]),
    AuthModule,
  ],
  controllers: [VoteController],
  providers: [VoteService],
})
export class VoteModule {}
