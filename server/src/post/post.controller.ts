import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import JwtAuthGuard from 'src/auth/guard/JwtAuthGuard';
import { CreatePostDto, GetPostParamDto } from 'src/comments/comments.dto';
import { CommentsService } from 'src/comments/comments.service';
import UserEntity from 'src/entities/user/user.entity';
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
  getPosts(@GetUser() user: UserEntity) {
    return this.postService.getPosts(user);
  }

  @Get('/:identifier/:slug')
  getPost(@Param() getPostParam: GetPostParamDto) {
    return this.postService.getPost(getPostParam);
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
}
