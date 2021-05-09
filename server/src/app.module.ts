import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { authMiddleware } from './auth/middleware/auth.middleware';
import { PostModule } from './post/post.module';
import { SubsModule } from './subs/subs.module';
import { CommentsModule } from './comments/comments.module';
import { VoteModule } from './vote/vote.module';
import * as typeOrmConfig from './config/typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PostModule,
    SubsModule,
    CommentsModule,
    VoteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(authMiddleware).forRoutes(AuthController);
  }
}
