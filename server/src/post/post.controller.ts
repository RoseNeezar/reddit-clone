import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import JwtAuthGuard from 'src/auth/guard/JwtAuthGuard';
import { CreatePostDto, GetPostParamDto } from 'src/comments/comments.dto';
import { CommentsService } from 'src/comments/comments.service';
import UserEntity from 'src/entities/user/user.entity';
import { GetPaginatedPostParamDto } from './post.dto';
import { PostService } from './post.service';

@Controller('/api/posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Post('/')
  @UseGuards(AuthGuard())
  createPost(
    @Body(ValidationPipe) createPost: CreatePostDto,
    @GetUser() user: UserEntity,
  ) {
    return this.postService.createPost(createPost, user);
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  getPosts(
    @Query() post: GetPaginatedPostParamDto,
    @GetUser() user: UserEntity,
  ) {
    return this.postService.getPosts(post, user);
  }

  @Get('/:identifier/:slug')
  @UseGuards(JwtAuthGuard)
  getPost(@Param() getPostParam: GetPostParamDto, @GetUser() user: UserEntity) {
    return this.postService.getPost(getPostParam, user);
  }

  @Post('/:identifier/:slug/comments')
  @UseGuards(AuthGuard())
  commentOnPost(
    @Param() getPostParam: GetPostParamDto,
    @Body() body: { body: string },
    @GetUser() user: UserEntity,
  ) {
    return this.postService.commentOnPost(getPostParam, user, body.body);
  }

  @Get('/:identifier/:slug/comments')
  @UseGuards(JwtAuthGuard)
  getPostComments(
    @Param() getPostParam: GetPostParamDto,
    @GetUser() user: UserEntity,
  ) {
    return this.postService.getPostComments(getPostParam, user);
  }
}
