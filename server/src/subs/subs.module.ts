import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CommentsRepository } from 'src/entities/comments/comments.repository';
import { PostRepository } from 'src/entities/post/post.repository';
import { SubRepository } from 'src/entities/sub/sub.repository';
import { SubsController } from './subs.controller';
import { SubsService } from './subs.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CommentsRepository,
      SubRepository,
      PostRepository,
    ]),
    MulterModule.register({
      dest: './public/images',
    }),
    AuthModule,
  ],
  controllers: [SubsController],
  providers: [SubsService],
})
export class SubsModule {}
