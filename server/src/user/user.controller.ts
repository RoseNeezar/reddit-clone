import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/get-user.decorator';
import JwtAuthGuard from 'src/auth/guard/JwtAuthGuard';
import UserEntity from 'src/entities/user/user.entity';
import { UserService } from './user.service';

@Controller('api/users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('/:username')
  @UseGuards(JwtAuthGuard)
  getUserSubmissions(
    @Param('username') username: string,
    @GetUser() user: UserEntity,
  ) {
    return this.userService.getUserSubmissions(username, user);
  }
}
