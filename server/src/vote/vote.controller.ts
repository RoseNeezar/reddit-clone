import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import UserEntity from 'src/entities/user/user.entity';
import { VoteDto } from './vote.dto';
import { VoteService } from './vote.service';

@Controller('api/vote')
export class VoteController {
  constructor(private voteService: VoteService) {}

  @Post('/')
  @UseGuards(AuthGuard())
  vote(@Body(ValidationPipe) voting: VoteDto, @GetUser() user: UserEntity) {
    return this.voteService.vote(voting, user);
  }
}
